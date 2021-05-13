using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Enums;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Integrations.Usos.Core;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;
using System;
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
        private readonly IJWTAuthenticationService _jwtService;
        private readonly IUsosService _usosService;
        private readonly IRepository<User> _userRepository;
        private readonly UsosServiceOptions _options;
        public AuthorizeController(IJWTAuthenticationService jwtService, IUsosService usosService,
            IRepository<User> userRepository, IOptions<UsosServiceOptions> options)
        {
            _jwtService = jwtService;
            _usosService = usosService;
            _userRepository = userRepository;
            _options = options.Value;
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
            //TODO: Run requests in parallel
            var isParticipant = await _usosService.IsCurrentUserCourseParticipant(oauthRequest, currentTerm.Id);
            var isLecturer = await _usosService.IsCurrentUserCourseLecturer(oauthRequest, currentTerm.Id);

            var user = _userRepository.GetAll().FirstOrDefault(p => p.UsosId == usosUser.Id);
            var accessType = AccessType.Unknown;
            if (isLecturer)
            {
                accessType = AccessType.Employee;
            }
            else if (isParticipant)
            {
                accessType = AccessType.Default;
            }

            if (usosUser.Id == _options.DefaultAdministratorUsosId)
            {
                accessType = AccessType.Admin;
            }

            if (user == null)
            {
                await _userRepository.AddAsync(new User()
                {
                    UsosId = usosUser.Id,
                    FirstLoginAt = DateTime.Now,
                    LastLoginAt = DateTime.Now,
                    AccessType = accessType
                });
            }
            else
            {
                if (usosUser.Id == _options.DefaultAdministratorUsosId)
                {
                    accessType = AccessType.Admin;
                }
                else if (user.AccessType == AccessType.Admin || user.CustomAccess)
                {
                    accessType = user.AccessType;
                }

                user.AccessType = accessType;
                user.LastLoginAt = DateTime.Now;
                await _userRepository.UpdateAsync(user);
            }

            var authClaims = new AuthClaims
            {
                Id = usosUser.Id,
                AccessType = accessType,
                Token = accessTokenResponse.OAuthToken,
                TokenSecret = accessTokenResponse.OAuthTokenSecret
            };
            var authClaimsIdentity = _jwtService.GenerateClaimsIdentity(authClaims);
            var authJWT = _jwtService.GenerateJWE(authClaimsIdentity);

            var userClaims = new UserClaims
            {
                Id = usosUser.Id,
                Name = $"{usosUser.FirstName} {usosUser.LastName}",
                Email = usosUser.Email ?? string.Empty,
                AvatarUrl = usosUser.PhotoUrls.FirstOrDefault().Value ?? string.Empty,
                AccessType = accessType
            };
            var userClaimsIdentity = _jwtService.GenerateClaimsIdentity(userClaims);
            var userJWT = _jwtService.GenerateJWS(userClaimsIdentity);

            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureToken, _jwtService.GetTokenCookieOptions());
            HttpContext.Response.Cookies.Append(AuthenticationCookies.SecureAuth, authJWT, _jwtService.GetAuthCookieOptions());
            HttpContext.Response.Cookies.Append(AuthenticationCookies.SecureUser, userJWT, _jwtService.GetUserCookieOptions());

            //TODO: Redirect user somewhere
            return new OkResult();
        }
    }
}
