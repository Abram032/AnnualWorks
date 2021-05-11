﻿using Microsoft.AspNetCore.Http;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Integrations.Usos.Core
{
    public interface IUsosService
    {
        Uri GetBaseAddress();
        Uri GetRedirectAddress(string token);
        Uri GetLogoutAddress();
        Task<OAuthResponse> GetRequestTokenAsync(HttpContext context);
        Task<OAuthResponse> GetAccessTokenAsync(OAuthRequest oauthRequest);
        Task RevokeAccessTokenAsync(OAuthRequest oauthRequest);
        Task<UsosUser> GetCurrentUser(OAuthRequest oauthRequest);
        Task<List<UsosUser>> GetUsers(OAuthRequest oauthRequest, List<string> userIds);
        Task<UsosTerm> GetCurrentTerm(OAuthRequest oauthRequest);
        Task<UsosTerm> GetTerm(OAuthRequest oauthRequest, string termId);
        Task<List<UsosTerm>> GetTerms(OAuthRequest oauthRequest);
        Task<bool> IsCurrentUserCourseParticipant(OAuthRequest oauthRequest, string termId);
        Task<bool> IsCurrentUserCourseLecturer(OAuthRequest oauthRequest, string termId);
        Task<bool> IsCurrentUserCourseCoordinator(OAuthRequest oauthRequest, string termId);
        Task<List<UsosUser>> GetCourseEditionParticipants(OAuthRequest oauthRequest, string termId);
        Task<List<UsosUser>> GetCourseEditionLecturers(OAuthRequest oauthRequest, string termId);
        Task<List<UsosUser>> GetCourseEditionCoordinators(OAuthRequest oauthRequest, string termId);
    }
}
