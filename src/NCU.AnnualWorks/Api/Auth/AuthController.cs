using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Api.Auth.Models;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Constants;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Options;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using NCU.AnnualWorks.Integrations.Usos.Core;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Auth
{
    [Authorize(AuthorizationPolicies.AuthenticatedOnly)]
    public class AuthController : ApiControllerBase
    {
        private readonly IUsosService _usosService;
        private readonly IJWTAuthenticationService _jwtService;
        private readonly IAsyncRepository<User> _userRepository;
        private readonly UsosServiceOptions _usosOptions;
        private readonly ApplicationOptions _appOptions;
        private readonly IMapper _mapper;
        private readonly IThesisService _thesisService;
        public AuthController(IUsosService usosService, IJWTAuthenticationService jwtService,
            IAsyncRepository<User> userRepository, IOptions<UsosServiceOptions> usosOptions,
            IOptions<ApplicationOptions> appOptions, IMapper mapper, IThesisService thesisService)
        {
            _usosService = usosService;
            _jwtService = jwtService;
            _userRepository = userRepository;
            _usosOptions = usosOptions.Value;
            _appOptions = appOptions.Value;
            _mapper = mapper;
            _thesisService = thesisService;
        }

        [IgnoreAntiforgeryToken]
        [HttpPost("Authenticate")]
        [AllowAnonymous]
        public async Task<IActionResult> Authenticate()
        {
            var callbackUrl = HttpContext.GetBaseAddressWithPath(_usosOptions.CallbackEndpoint);
            var oauthRequest = HttpContext.BuildOAuthRequest(null, null, callback: callbackUrl);
            var response = await _usosService.GetRequestTokenAsync(oauthRequest);

            var claims = new AuthClaims
            {
                Id = string.Empty,
                Token = response.OAuthToken,
                TokenSecret = response.OAuthTokenSecret,
            };
            var claimsIdentity = _jwtService.GenerateClaimsIdentity(claims);
            var jwt = _jwtService.GenerateJWE(claimsIdentity);

            HttpContext.Response.Cookies.Append(AuthenticationCookies.SecureToken, jwt, _jwtService.GetTokenCookieOptions());
            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureAuth, _jwtService.GetAuthCookieOptions());
            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureUser, _jwtService.GetUserCookieOptions());
            HttpContext.Response.Cookies.Delete(AntiforgeryConsts.CookieName);
            HttpContext.Response.Cookies.Delete(AntiforgeryConsts.FormCookieName);

            return new OkObjectResult(_usosService.GetRedirectAddress(response.OAuthToken).ToString());
        }

        [IgnoreAntiforgeryToken]
        [HttpPost("Authorize")]
        [AllowAnonymous]
        public async Task<IActionResult> Authorize(AuthorizeRequest request)
        {
            var accessTokenResponse = await _usosService.GetAccessTokenAsync(HttpContext.BuildOAuthRequest(token: request.OAuthToken, verifier: request.OAuthVerifier));

            var oauthRequest = HttpContext.BuildOAuthRequest(accessTokenResponse.OAuthToken, accessTokenResponse.OAuthTokenSecret);

            //TODO: Clean up with GetUserPermission and such
            var usosUser = await _usosService.GetCurrentUser(oauthRequest);
            var currentTerm = await _usosService.GetCurrentTerm(oauthRequest);

            //TODO: Run requests in parallel
            bool? isParticipant = await _usosService.IsCurrentUserCourseParticipant(oauthRequest, currentTerm.Id);
            bool? isLecturer = await _usosService.IsCurrentUserCourseLecturer(oauthRequest, currentTerm.Id);
            bool? customAccess = null;
            var isAdmin = false;

            var user = await _userRepository.GetAsync(int.Parse(usosUser.Id));
            if (usosUser.Id == _appOptions.DefaultAdministratorUsosId)
            {
                isAdmin = true;
            };

            if (user == null)
            {
                user = _mapper.Map<UsosUser, User>(usosUser);
                user.Email = usosUser.Email;
                user.FirstLoginAt = DateTime.Now;
                user.LastLoginAt = DateTime.Now;
                user.AdminAccess = isAdmin;
                await _userRepository.AddAsync(user);
            }
            else
            {
                if (!user.AdminAccess && isAdmin)
                {
                    user.AdminAccess = isAdmin;
                }
                user.LastLoginAt = DateTime.Now;
                user.Email = usosUser.Email != null ? usosUser.Email : user.Email;
                await _userRepository.UpdateAsync(user);
            }

            //Fallback
            if (isParticipant == null)
            {
                isParticipant = _thesisService.IsAuthor(user);
            }
            //Fallback, for safety reason we only set custom access
            if (isLecturer == null)
            {
                customAccess = _thesisService.IsPromoter(user);
            }

            if (_appOptions.DebugMode)
            {
                isAdmin = true;
                isParticipant = true;
                isLecturer = true;
            }

            var authClaims = new AuthClaims
            {
                Id = usosUser.Id,
                IsParticipant = isParticipant.GetValueOrDefault(),
                IsLecturer = isLecturer.GetValueOrDefault(),
                IsAdmin = user.AdminAccess,
                IsCustom = customAccess ?? user.CustomAccess, //If fallback didn't applied the rule, we take info from database
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
                IsParticipant = isParticipant.GetValueOrDefault(),
                IsLecturer = isLecturer.GetValueOrDefault(),
                IsAdmin = user.AdminAccess,
                IsCustom = customAccess ?? user.CustomAccess, //If fallback didn't applied the rule, we take info from database
            };
            var userClaimsIdentity = _jwtService.GenerateClaimsIdentity(userClaims);
            var userJWT = _jwtService.GenerateJWS(userClaimsIdentity);

            HttpContext.Response.Cookies.Append(AuthenticationCookies.SecureAuth, authJWT, _jwtService.GetAuthCookieOptions());
            HttpContext.Response.Cookies.Append(AuthenticationCookies.SecureUser, userJWT, _jwtService.GetUserCookieOptions());
            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureToken, _jwtService.GetTokenCookieOptions());
            HttpContext.Response.Cookies.Delete(AntiforgeryConsts.CookieName);
            HttpContext.Response.Cookies.Delete(AntiforgeryConsts.FormCookieName);

            //TODO: Redirect user somewhere
            return new OkResult();
        }

        [IgnoreAntiforgeryToken]
        [HttpPost("SignOut")]
        public async Task<IActionResult> SignOut()
        {
            var oauthRequest = HttpContext.BuildOAuthRequest();
            await _usosService.RevokeAccessTokenAsync(oauthRequest);

            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureToken, _jwtService.GetTokenCookieOptions());
            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureAuth, _jwtService.GetAuthCookieOptions());
            HttpContext.Response.Cookies.Delete(AuthenticationCookies.SecureUser, _jwtService.GetUserCookieOptions());
            HttpContext.Response.Cookies.Delete(AntiforgeryConsts.CookieName);
            HttpContext.Response.Cookies.Delete(AntiforgeryConsts.FormCookieName);

            var callback = $"?url={HttpContext.Request.Scheme}://{HttpContext.Request.Host}";
            var redirectUri = new Uri(_usosService.GetLogoutAddress(), callback).ToString();

            return new OkObjectResult(redirectUri);
        }
    }
}
