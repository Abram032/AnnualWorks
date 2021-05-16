﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Api.Auth.Models;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Enums;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Options;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Integrations.Usos.Core;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Auth
{
    [Authorize(AuthorizationPolicies.AtLeastUnknown)]
    public class AuthController : ApiControllerBase
    {
        private readonly IUsosService _usosService;
        private readonly IJWTAuthenticationService _jwtService;
        private readonly IAsyncRepository<User> _userRepository;
        private readonly UsosServiceOptions _usosOptions;
        private readonly ApplicationOptions _appOptions;
        private readonly IMapper _mapper;
        public AuthController(IUsosService usosService, IJWTAuthenticationService jwtService,
            IAsyncRepository<User> userRepository, IOptions<UsosServiceOptions> usosOptions,
            IOptions<ApplicationOptions> appOptions, IMapper mapper)
        {
            _usosService = usosService;
            _jwtService = jwtService;
            _userRepository = userRepository;
            _usosOptions = usosOptions.Value;
            _appOptions = appOptions.Value;
            _mapper = mapper;
        }

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

        [HttpPost("Authorize")]
        public async Task<IActionResult> Authorize(AuthorizeRequest request)
        {
            var oauthRequest = HttpContext.BuildOAuthRequest(token: request.OAuthToken, verifier: request.OAuthVerifier);
            var accessTokenResponse = await _usosService.GetAccessTokenAsync(oauthRequest);

            oauthRequest = HttpContext.BuildOAuthRequest(accessTokenResponse.OAuthToken, accessTokenResponse.OAuthTokenSecret);

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

            if (usosUser.Id == _appOptions.DefaultAdministratorUsosId)
            {
                accessType = AccessType.Admin;
            }

            if (user == null)
            {
                user = _mapper.Map<UsosUser, User>(usosUser);
                user.FirstLoginAt = DateTime.Now;
                user.LastLoginAt = DateTime.Now;
                user.AccessType = accessType;
                await _userRepository.AddAsync(user);
            }
            else
            {
                if (usosUser.Id == _appOptions.DefaultAdministratorUsosId || user.AccessType == AccessType.Admin)
                {
                    accessType = AccessType.Admin;
                }
                else if (user.CustomAccess)
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

        [HttpPost("SignOut")]
        [Authorize(AuthorizationPolicies.AtLeastDefault)]
        public async Task<IActionResult> SignOut()
        {
            var oauthRequest = HttpContext.BuildOAuthRequest();
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
