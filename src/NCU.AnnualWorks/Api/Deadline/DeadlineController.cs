using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Api.Deadline.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Services;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Deadline
{
    [Authorize(AuthorizationPolicies.AuthenticatedOnly)]
    public class DeadlineController : ApiControllerBase
    {
        public readonly ISettingsService _settingsService;
        public DeadlineController(ISettingsService settingsService)
        {
            _settingsService = settingsService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCurrentDeadline()
            => new OkObjectResult(await _settingsService.GetDeadline(HttpContext.BuildOAuthRequest()));

        [HttpPut]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> SetDeadline([FromBody] SetDeadlineRequest request)
        {
            var result = await _settingsService.SetDeadline(HttpContext.BuildOAuthRequest(), request.Deadline);
            if (result)
            {
                return new OkResult();
            }
            else
            {
                return new BadRequestObjectResult("Nieprawidłowa data.");
            }
        }
    }
}
