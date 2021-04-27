using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.Core.Abstractions;
using NCU.AnnualWorks.Authentication.Core.Constants;
using NCU.AnnualWorks.Authentication.Core.Enums;
using NCU.AnnualWorks.Authentication.Core.Models.Claims;
using NCU.AnnualWorks.Authentication.Core.Models.OAuth;
using NCU.AnnualWorks.Authentication.Core.Options;
using NCU.AnnualWorks.Authentication.Core.Utils;
using NCU.AnnualWorks.Integrations.Usos;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;
using System;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Controllers.Auth
{
    [AllowAnonymous]
    [Route("api/auth/[controller]")]
    [ApiController]
    public class AuthorizeController : ControllerBase
    {
        private readonly IOAuthTokenService _tokenService;
        private readonly JWTAuthenticationOptions _jwtOptions;
        private readonly UsosClientOptions _usosOptions;
        private readonly UsosClient _client;
        public AuthorizeController(IOptions<JWTAuthenticationOptions> jwtOptions,
            IOptions<UsosClientOptions> usosOptions, UsosClient client, IOAuthTokenService tokenService)
        {
            _jwtOptions = jwtOptions.Value;
            _usosOptions = usosOptions.Value;
            _client = client;
            _tokenService = tokenService;
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync(OAuthRequest request)
        {
            request.OAuthTokenSecret = _tokenService.Get(request.OAuthToken);
            var response = await _client.GetAccessTokenAsync(HttpContext, request);
            if (response.IsSuccessStatusCode)
            {
                var tokenResponse = await _client.ParseAccessTokenResponseAsync(response.Content);

                _tokenService.Remove(request.OAuthToken);
                _tokenService.SetAccessToken(tokenResponse.OAuthToken, tokenResponse.OAuthTokenSecret);

                //TODO: Send request to usos for user data and privilages
                var authClaims = new AuthClaims
                {
                    Id = 0,
                    UserType = UserType.Student,
                    Token = tokenResponse.OAuthToken
                };
                var authJWT = JWTAuthenticationUtils.GenerateOAuthJWT(authClaims, _jwtOptions.Secret);

                var userClaims = new UserClaims
                {
                    Id = 0,
                    Email = "",
                    Name = ""
                };
                var userJWT = JWTAuthenticationUtils.GenerateUserJWT(userClaims, _jwtOptions.Secret);

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
