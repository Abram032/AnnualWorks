using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Api.Users.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto.Users;
using NCU.AnnualWorks.Core.Options;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Integrations.Usos.Core;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Users
{
    [Authorize(AuthorizationPolicies.AtLeastEmployee)]
    public class UsersController : ApiControllerBase
    {
        private readonly IUsosService _usosService;
        private readonly IMapper _mapper;
        private readonly IAsyncRepository<User> _userRepository;
        private readonly ApplicationOptions _options;
        public UsersController(IUsosService usosService, IMapper mapper,
            IAsyncRepository<User> userRepository, IOptions<ApplicationOptions> options)
        {
            _usosService = usosService;
            _mapper = mapper;
            _userRepository = userRepository;
            _options = options.Value;
        }

        [HttpGet("Students")]
        public async Task<IActionResult> GetStudents()
        {
            var oauthRequest = HttpContext.BuildOAuthRequest();
            var currentTerm = await _usosService.GetCurrentTerm(oauthRequest);
            var participants = await _usosService.GetCourseEditionParticipants(oauthRequest, currentTerm.Id);
            var participantsIds = participants.Select(p => p.Id).ToList();
            var usosUsers = await _usosService.GetUsers(oauthRequest, participantsIds);
            var users = _mapper.Map<List<UsosUser>, List<UserDTO>>(usosUsers);

            return new OkObjectResult(users);
        }

        [HttpGet("Employees")]
        public async Task<IActionResult> GetEmployees()
        {
            var oauthRequest = HttpContext.BuildOAuthRequest();
            var currentTerm = await _usosService.GetCurrentTerm(oauthRequest);
            var lecturers = await _usosService.GetCourseEditionLecturers(oauthRequest, currentTerm.Id);

            var customUserIds = _userRepository.GetAll()
                .Where(p => p.CustomAccess)
                .Select(p => p.UsosId).ToList();
            var lecturersIds = lecturers.Select(l => l.Id).ToList();

            var userIds = customUserIds.Concat(lecturersIds).Distinct().ToList();

            var usosUsers = await _usosService.GetUsers(oauthRequest, userIds);
            var users = _mapper.Map<List<UsosUser>, List<UserDTO>>(usosUsers);

            return new OkObjectResult(users);
        }

        [HttpPost("Employees")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> AddCustomEmployee([FromBody] CreateUserRequest request)
        {
            //TODO: Add validation
            if (request == null || string.IsNullOrWhiteSpace(request.UsosId))
            {
                return new BadRequestObjectResult("Brak użytkownika");
            }

            var user = _userRepository.GetAll().FirstOrDefault(p => p.UsosId == request.UsosId);

            if (user == null)
            {
                await _userRepository.AddAsync(new User
                {
                    UsosId = request.UsosId,
                    CustomAccess = true,
                });

                return new OkResult();
            }

            user.CustomAccess = true;
            await _userRepository.UpdateAsync(user);
            return new OkResult();
        }

        [HttpDelete("Employees/{usosId}")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> RemoveCustomEmployee(string usosId)
        {
            //TODO: Add validation
            if (string.IsNullOrWhiteSpace(usosId))
            {
                return new BadRequestObjectResult("Brak użytkownika");
            }

            var user = _userRepository.GetAll().FirstOrDefault(p => p.UsosId == usosId);

            if (user == null)
            {
                return new NotFoundResult();
            }

            if (!user.CustomAccess)
            {
                return new ConflictObjectResult("Użytkownik nie posiada już dostępu.");
            }

            user.CustomAccess = false;

            await _userRepository.UpdateAsync(user);
            return new OkResult();
        }

        [HttpGet("Admins")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> GetAdmins()
        {
            var oauthRequest = HttpContext.BuildOAuthRequest();

            var userIds = _userRepository.GetAll()
                .Where(p => p.AdminAccess)
                .Select(p => p.UsosId).ToList();

            userIds.Add(_options.DefaultAdministratorUsosId);
            userIds = userIds.Distinct().ToList();
            //TODO: Add flag for default admin to render properly on front
            var usosUsers = await _usosService.GetUsers(oauthRequest, userIds);
            var users = _mapper.Map<List<UsosUser>, List<UserDTO>>(usosUsers);

            return new OkObjectResult(users);
        }

        [HttpPost("Admins")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> AddAdmin([FromBody] CreateUserRequest request)
        {
            //TODO: Add validation
            if (request == null || string.IsNullOrWhiteSpace(request.UsosId))
            {
                return new BadRequestObjectResult("Brak użytkownika");
            }

            if (request.UsosId == _options.DefaultAdministratorUsosId)
            {
                return new ConflictObjectResult("Główny administrator jest już administratorem.");
            }

            var user = _userRepository.GetAll().FirstOrDefault(p => p.UsosId == request.UsosId);

            if (user == null)
            {
                await _userRepository.AddAsync(new User
                {
                    UsosId = request.UsosId,
                    AdminAccess = true,
                });

                return new OkResult();
            }

            if (user.AdminAccess)
            {
                return new ConflictObjectResult("Użytkownik jest już administratorem");
            }

            user.AdminAccess = true;
            await _userRepository.UpdateAsync(user);
            return new OkResult();
        }

        [HttpDelete("Admins/{usosId}")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> RemoveAdmin(string usosId)
        {
            //TODO: Add validation
            if (string.IsNullOrWhiteSpace(usosId))
            {
                return new BadRequestObjectResult("Brak użytkownika");
            }

            if (usosId == _options.DefaultAdministratorUsosId)
            {
                return new ConflictObjectResult("Nie można usunąć głównego administratora.");
            }

            var user = _userRepository.GetAll().FirstOrDefault(p => p.UsosId == usosId);

            if (user == null)
            {
                return new NotFoundResult();
            }

            if (!user.AdminAccess)
            {
                return new ConflictObjectResult("Użytkownik nie jest administratorem");
            }

            user.AdminAccess = false;
            await _userRepository.UpdateAsync(user);
            return new OkResult();
        }
    }
}
