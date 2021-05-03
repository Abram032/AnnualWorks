using Microsoft.AspNetCore.Http;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using System;
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
        Task RevokeAccessTokenAsync(OAuthRequest oAuthRequest);
        Task<UsosUser> GetCurrentUser(OAuthRequest oauthRequest);
        Task<UsosTerm> GetCurrentTerm(OAuthRequest oauthRequest);
        Task<bool> IsCurrentUserCourseParticipant(OAuthRequest oauthRequest, string termId);
        Task<bool> IsCurrentUserCourseLecturer(OAuthRequest oauthRequest, string termId);
        Task<bool> IsCurrentUserCourseCoordinator(OAuthRequest oauthRequest, string termId);
    }
}
