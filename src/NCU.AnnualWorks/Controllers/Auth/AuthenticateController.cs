using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Enums;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Core;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Controllers.Auth
{
    [AllowAnonymous]
    [Route("api/auth/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly IUsosService _usosService;
        private readonly IJWTAuthenticationService _jwtService;
        public AuthenticateController(IUsosService usosService, IJWTAuthenticationService jwtService)
        {
            _usosService = usosService;
            _jwtService = jwtService;
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync()
        {
            var response = await _usosService.GetRequestTokenAsync(HttpContext);

            var claims = new AuthClaims
            {
                Id = string.Empty,
                AccessType = AccessType.Unknown,
                Token = response.OAuthToken,
                TokenSecret = response.OAuthTokenSecret,
            };
            var claimsIdentity = _jwtService.GenerateClaimsIdentity(claims);
            var jwt = _jwtService.GenerateJWE(claimsIdentity);

            HttpContext.Response.Cookies.Append(AuthenticationCookies.SecureToken, jwt, _jwtService.GetTokenCookieOptions());
            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureAuth, _jwtService.GetAuthCookieOptions());
            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureUser, _jwtService.GetUserCookieOptions());

            return new OkObjectResult(_usosService.GetRedirectAddress(response.OAuthToken).ToString());
        }
    }
}
