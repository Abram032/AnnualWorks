using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Models.Dto.Users;
using NCU.AnnualWorks.Integrations.Usos.Core;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Controllers
{
    [AutoValidateAntiforgeryToken]
    [Authorize(AuthenticationSchemes = AuthenticationSchemes.JWTAuthenticationScheme, Policy = AuthorizationPolicies.AtLeastDefault)]
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly IUsosService _usosService;
        private readonly IMapper _mapper;
        public CourseController(IUsosService usosService, IMapper mapper)
        {
            _usosService = usosService;
            _mapper = mapper;
        }

        [HttpGet("participants")]
        public async Task<IActionResult> GetCourseParticipants()
        {
            var oauthRequest = HttpContext.BuildOAuthRequest();
            var currentTerm = await _usosService.GetCurrentTerm(oauthRequest);
            var participants = await _usosService.GetCourseEditionParticipants(oauthRequest, currentTerm.Id);
            var participantsIds = participants.Select(p => p.Id).ToList();
            var usosUsers = await _usosService.GetUsers(oauthRequest, participantsIds);
            var users = _mapper.Map<List<UsosUser>, List<UserDTO>>(usosUsers);

            return new OkObjectResult(users);
        }

        [HttpGet("lecturers")]
        public async Task<IActionResult> GetCourseLecturers()
        {
            var oauthRequest = HttpContext.BuildOAuthRequest();
            var currentTerm = await _usosService.GetCurrentTerm(oauthRequest);
            var lecturers = await _usosService.GetCourseEditionLecturers(oauthRequest, currentTerm.Id);
            var lecturersIds = lecturers.Select(l => l.Id).ToList();
            var usosUsers = await _usosService.GetUsers(oauthRequest, lecturersIds);
            var users = _mapper.Map<List<UsosUser>, List<UserDTO>>(usosUsers);

            return new OkObjectResult(users);
        }

        [HttpGet("coordinators")]
        public async Task<IActionResult> GetCourseCoordinators()
        {
            var oauthRequest = HttpContext.BuildOAuthRequest();
            var currentTerm = await _usosService.GetCurrentTerm(oauthRequest);
            var lecturers = await _usosService.GetCourseEditionCoordinators(oauthRequest, currentTerm.Id);
            var lecturersIds = lecturers.Select(l => l.Id).ToList();
            var usosUsers = await _usosService.GetUsers(oauthRequest, lecturersIds);
            var users = _mapper.Map<List<UsosUser>, List<UserDTO>>(usosUsers);

            return new OkObjectResult(users);
        }
    }
}
