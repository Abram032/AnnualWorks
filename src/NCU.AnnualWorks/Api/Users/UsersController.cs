using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Api.Users.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Extensions.Mapping;
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
        private readonly IUserRepository _userRepository;
        private readonly ApplicationOptions _options;
        private readonly IUserContext _userContext;
        public UsersController(IUsosService usosService, IMapper mapper,
            IUserRepository userRepository, IOptions<ApplicationOptions> options,
            IUserContext userContext)
        {
            _usosService = usosService;
            _mapper = mapper;
            _userRepository = userRepository;
            _options = options.Value;
            _userContext = userContext;
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

        [HttpGet("Custom")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> GetCustomUsers()
        {
            var userIds = _userRepository.GetAll()
                .Where(u => u.CustomAccess)
                .Select(u => u.UsosId)
                .ToList();

            var usosUsers = await _usosService.GetUsers(HttpContext.BuildOAuthRequest(), userIds);
            var users = _mapper.Map<List<UsosUser>, List<UserDTO>>(usosUsers);

            return new OkObjectResult(users);
        }

        [HttpPut("Custom")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> UpdateCustomUsers([FromBody] UpdateCustomUsersRequest request)
        {
            var currentCustomUsers = _userRepository.GetAll().Where(u => u.CustomAccess);
            //var newAdmins = _userRepository.GetAll().Where(u => request.UserIds.Contains(u.UsosId));

            foreach (var user in currentCustomUsers)
            {
                user.CustomAccess = false;
            }
            var newUsers = new List<User>();
            foreach (var userId in request.UserIds)
            {
                var user = await _userRepository.GetAsync(userId);
                if (user == null)
                {
                    var usosUser = await _usosService.GetUser(HttpContext.BuildOAuthRequest(), userId);
                    user = _mapper.Map<UsosUser, User>(usosUser);
                    await _userRepository.AddAsync(user);
                }
                user.CustomAccess = true;
                newUsers.Add(user);
            }

            await _userRepository.UpdateRangeAsync(currentCustomUsers);
            await _userRepository.UpdateRangeAsync(newUsers);

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

        [HttpGet("Admins/Default")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> GetDefaultAdmin()
        {
            var usosUser = await _usosService.GetUser(HttpContext.BuildOAuthRequest(), _options.DefaultAdministratorUsosId);
            var user = _mapper.Map<UsosUser, UserDTO>(usosUser);

            return new OkObjectResult(user);
        }

        [HttpPut("Admins")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> UpdateAdmins([FromBody] UpdateAdminsRequest request)
        {
            //Removing default administrator from list if added
            request.UserIds.Remove(_options.DefaultAdministratorUsosId);

            var currentAdmins = _userRepository.GetAll().Where(u => u.AdminAccess && u.UsosId != _options.DefaultAdministratorUsosId);
            //var newAdmins = _userRepository.GetAll().Where(u => request.UserIds.Contains(u.UsosId));

            foreach (var admin in currentAdmins)
            {
                admin.AdminAccess = false;
            }
            var newAdmins = new List<User>();
            foreach (var userId in request.UserIds)
            {
                var user = await _userRepository.GetAsync(userId);
                if (user == null)
                {
                    var usosUser = await _usosService.GetUser(HttpContext.BuildOAuthRequest(), userId);
                    user = _mapper.Map<UsosUser, User>(usosUser);
                    await _userRepository.AddAsync(user);
                }
                user.AdminAccess = true;
                newAdmins.Add(user);
            }

            await _userRepository.UpdateRangeAsync(currentAdmins);
            await _userRepository.UpdateRangeAsync(newAdmins);

            return new OkResult();
        }

        [HttpGet]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> SearchUser([FromQuery] string search)
        {
            var usosUsers = await _usosService.SearchUsers(HttpContext.BuildOAuthRequest(), search);
            var users = _mapper.Map<List<UsosUser>, List<UserDTO>>(usosUsers);

            return new OkObjectResult(users);
        }

        [HttpGet("All")]
        public async Task<IActionResult> GetAll()
        {
            var users = _userRepository.GetAll().Select(u => u.UsosId).ToList();
            var usosUsers = await _usosService.GetUsers(_userContext.GetCredentials(), users);

            return new OkObjectResult(usosUsers.ToDto());
        }
    }
}
