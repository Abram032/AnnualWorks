using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Enums;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Authentication.OAuth.Core;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using NCU.AnnualWorks.Integrations.Usos;
using System;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Controllers.Auth
{
    [AllowAnonymous]
    [Route("api/auth/[controller]")]
    [ApiController]
    public class AuthorizeController : ControllerBase
    {
        private readonly IOAuthService _oauthService;
        private readonly IJWTAuthenticationService _jwtService;
        private readonly UsosClient _client;
        public AuthorizeController(IOAuthService oauthService, IJWTAuthenticationService jwtService, UsosClient client)
        {
            _oauthService = oauthService;
            _jwtService = jwtService;
            _client = client;
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync(OAuthRequest request)
        {
            request.OAuthTokenSecret = _oauthService.Get(request.OAuthToken);
            var response = await _client.GetAccessTokenAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var tokenResponse = await _client.ParseAccessTokenResponseAsync(response.Content);

                _oauthService.Remove(request.OAuthToken);
                _oauthService.SetAccessToken(tokenResponse.OAuthToken, tokenResponse.OAuthTokenSecret);

                //TODO: Send request to usos for user data and privilages
                var authClaims = new AuthClaims
                {
                    Id = 0,
                    UserType = UserType.Student,
                    Token = tokenResponse.OAuthToken,
                    TokenSecret = tokenResponse.OAuthTokenSecret
                };
                var authClaimsIdentity = _jwtService.GenerateClaimsIdentity(authClaims);
                var authJWT = _jwtService.GenerateJWE(authClaimsIdentity);

                var userClaims = new UserClaims
                {
                    Id = 0,
                    Email = "",
                    Name = ""
                };
                var userClaimsIdentity = _jwtService.GenerateClaimsIdentity(userClaims);
                var userJWT = _jwtService.GenerateJWS(userClaimsIdentity);

                var cookieOptions = new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddMinutes(90),
                    SameSite = SameSiteMode.Strict,
                    Secure = true,
                    HttpOnly = true,
                    IsEssential = true
                };
                HttpContext.Response.Cookies.Append(AuthenticationCookies.SecureAuth, authJWT, cookieOptions);
                HttpContext.Response.Cookies.Append(AuthenticationCookies.SecureUser, userJWT, cookieOptions);

                //TODO: Redirect user somewhere
                return new OkResult();
            }

            //TODO: Add logging
            //Something went terribly wrong and USOS did not returned a request token
            return new StatusCodeResult(500);
        }
    }
}
