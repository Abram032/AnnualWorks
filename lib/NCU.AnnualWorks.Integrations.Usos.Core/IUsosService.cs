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
        string GetCourseCode();
        Task<OAuthResponse> GetRequestTokenAsync(OAuthRequest oauthRequest);
        Task<OAuthResponse> GetAccessTokenAsync(OAuthRequest oauthRequest);
        Task RevokeAccessTokenAsync(OAuthRequest oauthRequest);
        Task<UsosUser> GetCurrentUser(OAuthRequest oauthRequest);
        Task<UsosUser> GetUser(OAuthRequest oauthRequest, string userId);
        Task<List<UsosUser>> GetUsers(OAuthRequest oauthRequest, IEnumerable<string> userIds);
        Task<UsosTerm> GetCurrentTerm(OAuthRequest oauthRequest);
        Task<UsosTerm> GetTerm(OAuthRequest oauthRequest, string termId);
        Task<List<UsosTerm>> GetTerms(OAuthRequest oauthRequest);
        Task<bool?> IsCurrentUserCourseParticipant(OAuthRequest oauthRequest, string termId);
        Task<bool?> IsCurrentUserCourseLecturer(OAuthRequest oauthRequest, string termId);
        Task<bool?> IsCurrentUserCourseCoordinator(OAuthRequest oauthRequest, string termId);
        Task<List<UsosUser>> GetCourseEditionParticipants(OAuthRequest oauthRequest, string termId);
        Task<List<UsosUser>> GetCourseEditionLecturers(OAuthRequest oauthRequest, string termId);
        Task<List<UsosUser>> GetCourseEditionCoordinators(OAuthRequest oauthRequest, string termId);
        Task<bool> CourseExists(OAuthRequest oauthRequest, string courseId, string termId);
        Task<string> GetCourseUrl(OAuthRequest oauthRequest, string courseId);
        Task<List<UsosUser>> SearchUsers(OAuthRequest oauthRequest, string userQuery);
    }
}
