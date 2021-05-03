using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Authentication.OAuth.Core;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Core;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Controllers.Auth
{
    [Authorize(AuthenticationSchemes = AuthenticationSchemes.JWTAuthenticationScheme)]
    [Route("api/auth/[controller]")]
    [ApiController]
    public class SignOutController : ControllerBase
    {
        private readonly IOAuthService _oauthService;
        private readonly IJWTAuthenticationService _jwtService;
        private readonly IUsosService _usosService;
        public SignOutController(IOAuthService oauthService, IJWTAuthenticationService jwtService, IUsosService usosService)
        {
            _oauthService = oauthService;
            _jwtService = jwtService;
            _usosService = usosService;
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync()
        {
            var token = this.HttpContext.User.Claims.FirstOrDefault(c => c.Type == nameof(AuthClaims.Token)).Value;
            var tokenSecret = this.HttpContext.User.Claims.FirstOrDefault(c => c.Type == nameof(AuthClaims.TokenSecret)).Value;
            var oauthRequest = new OAuthRequest()
            {
                OAuthToken = token,
                OAuthTokenSecret = tokenSecret
            };
            await _usosService.RevokeAccessTokenAsync(oauthRequest);

            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureToken, _jwtService.GetTokenCookieOptions());
            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureAuth, _jwtService.GetAuthCookieOptions());
            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureUser, _jwtService.GetUserCookieOptions());

            var callback = $"?url={HttpContext.Request.Scheme}://{HttpContext.Request.Host}";
            var redirectUri = new Uri(_usosService.GetLogoutAddress(), callback).ToString();

            return new OkObjectResult(redirectUri);
        }
    }
}
