using Microsoft.AspNetCore.Http;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using System.Linq;

namespace NCU.AnnualWorks.Authentication.JWT
{
    public class UserContext : IUserContext
    {
        public CurrentUser CurrentUser { get; private set; }

        public void SetCurrentUser(HttpContext context)
        {
            CurrentUser = new CurrentUser
            {
                Id = CurrentUserUsosId(context),
                IsAdmin = IsCurrentUserAdmin(context),
                IsCustom = IsCurrentUserCustom(context),
                IsEmployee = IsCurrentUserEmployee(context),
                IsLecturer = IsCurrentUserLecturer(context),
                IsParticipant = IsCurrentUserParticipant(context),
                Token = CurrentUserToken(context),
                TokenSecret = CurrentUserTokenSecret(context)
            };
        }

        public OAuthRequest GetCredentials() => new OAuthRequest
        {
            OAuthToken = CurrentUser.Token,
            OAuthTokenSecret = CurrentUser.TokenSecret
        };

        private long CurrentUserUsosId(HttpContext context)
            => long.TryParse(context?.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.Id))?.Value, out var id) ? id : default;

        private bool IsCurrentUserParticipant(HttpContext context)
            => bool.TryParse(context?.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.IsParticipant))?.Value, out var value) ? value : false;

        private bool IsCurrentUserLecturer(HttpContext context)
            => bool.TryParse(context?.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.IsLecturer))?.Value, out var value) ? value : false;

        private bool IsCurrentUserAdmin(HttpContext context)
            => bool.TryParse(context?.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.IsAdmin))?.Value, out var value) ? value : false;

        private bool IsCurrentUserCustom(HttpContext context)
            => bool.TryParse(context?.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.IsCustom))?.Value, out var value) ? value : false;

        private bool IsCurrentUserEmployee(HttpContext context)
            => IsCurrentUserLecturer(context) || IsCurrentUserAdmin(context) || IsCurrentUserCustom(context);

        private string CurrentUserToken(HttpContext context)
            => context.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.Token))?.Value;

        private string CurrentUserTokenSecret(HttpContext context)
            => context.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.TokenSecret))?.Value;
    }
}
