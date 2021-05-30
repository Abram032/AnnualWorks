using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Api.Course.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto.Course;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Integrations.Usos.Core;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Configure
{
    [Authorize(AuthorizationPolicies.AuthenticatedOnly)]
    public class CourseController : ApiControllerBase
    {
        private readonly IAsyncRepository<Settings> _settingsRepository;
        private readonly IUsosService _usosService;
        public CourseController(IAsyncRepository<Settings> settingsRepository, IUsosService usosService)
        {
            _settingsRepository = settingsRepository;
            _usosService = usosService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCourseConfiguration()
        {
            var settings = _settingsRepository.GetAll().Single();
            var term = await _usosService.GetCurrentTerm(HttpContext.BuildOAuthRequest());
            var url = await _usosService.GetCourseUrl(HttpContext.BuildOAuthRequest(), settings.CourseCode, term.Id);
            return new OkObjectResult(new CourseDTO
            {
                CourseCode = settings.CourseCode,
                CourseUrl = url
            });
        }

        [HttpPut]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> UpdateCourseConfiguration([FromBody] UpdateCourseRequest request)
        {
            var settings = _settingsRepository.GetAll().Single();
            var term = await _usosService.GetCurrentTerm(HttpContext.BuildOAuthRequest());
            var courseExists = await _usosService.CourseExists(HttpContext.BuildOAuthRequest(), request.CourseCode, term.Id);
            if (courseExists)
            {
                settings.CourseCode = request.CourseCode;
                await _settingsRepository.UpdateAsync(settings);

                return new OkResult();
            }
            else
            {
                return new BadRequestObjectResult("Kurs nie istnieje");
            }
        }
    }
}
