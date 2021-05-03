using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Enums;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Authentication.OAuth.Core;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Core;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Controllers.Auth
{
    //TODO: Add antiforgery check
    [Authorize(AuthenticationSchemes = AuthenticationSchemes.JWTAuthenticationScheme)]
    [Route("api/auth/[controller]")]
    [ApiController]
    public class AuthorizeController : ControllerBase
    {
        private readonly IOAuthService _oauthService;
        private readonly IJWTAuthenticationService _jwtService;
        private readonly IUsosService _usosService;
        public AuthorizeController(IOAuthService oauthService, IJWTAuthenticationService jwtService, IUsosService usosService)
        {
            _oauthService = oauthService;
            _jwtService = jwtService;
            _usosService = usosService;
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync(OAuthRequest request)
        {
            request.OAuthTokenSecret = this.HttpContext.User.Claims.FirstOrDefault(c => c.Type == nameof(AuthClaims.TokenSecret)).Value;

            var accessTokenResponse = await _usosService.GetAccessTokenAsync(request);
            var oauthRequest = new OAuthRequest()
            {
                OAuthToken = accessTokenResponse.OAuthToken,
                OAuthTokenSecret = accessTokenResponse.OAuthTokenSecret
            };

            //TODO: Clean up with GetUserPermission and such
            var usosUser = await _usosService.GetCurrentUser(oauthRequest);
            var currentTerm = await _usosService.GetCurrentTerm(oauthRequest);
            var isParticipant = await _usosService.IsCurrentUserCourseParticipant(oauthRequest, currentTerm.Id);
            var isLecturer = await _usosService.IsCurrentUserCourseLecturer(oauthRequest, currentTerm.Id);
            var isCoordinator = await _usosService.IsCurrentUserCourseCoordinator(oauthRequest, currentTerm.Id);
            //TODO: add check if is administrator, if yes skip and give access, if not check usos
            var isAdmin = false;
            var accessType = AccessType.Unknown;

            if (isAdmin)
            {
                accessType = AccessType.Admin;
            }
            else if (isLecturer || isCoordinator)
            {
                accessType = AccessType.Employee;
            }
            else if (isParticipant)
            {
                accessType = AccessType.Default;
            }

            var authClaims = new AuthClaims
            {
                Id = long.Parse(usosUser.Id),
                AccessType = accessType,
                Token = accessTokenResponse.OAuthToken,
                TokenSecret = accessTokenResponse.OAuthTokenSecret
            };
            var authClaimsIdentity = _jwtService.GenerateClaimsIdentity(authClaims);
            var authJWT = _jwtService.GenerateJWE(authClaimsIdentity);

            var userClaims = new UserClaims
            {
                Id = long.Parse(usosUser.Id),
                Name = $"{usosUser.FirstName} {usosUser.LastName}",
                AvatarUrl = usosUser.PhotoUrls.FirstOrDefault().Value ?? string.Empty,
                AccessType = accessType
            };
            var userClaimsIdentity = _jwtService.GenerateClaimsIdentity(userClaims);
            var userJWT = _jwtService.GenerateJWS(userClaimsIdentity);
            var cookieOptions = _jwtService.GetDefaultCookieOptions();

            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureToken, cookieOptions);
            HttpContext.Response.Cookies.Append(AuthenticationCookies.SecureAuth, authJWT, cookieOptions);
            HttpContext.Response.Cookies.Append(AuthenticationCookies.SecureUser, userJWT, cookieOptions);

            //TODO: Redirect user somewhere
            return new OkResult();
        }
    }
}
