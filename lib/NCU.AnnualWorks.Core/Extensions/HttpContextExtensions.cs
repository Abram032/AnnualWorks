using Microsoft.AspNetCore.Http;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using NCU.AnnualWorks.Core.Models;
using System.Linq;

namespace NCU.AnnualWorks.Core.Extensions
{
    public static class HttpContextExtensions
    {
        public static string GetBaseAddress(this HttpContext context)
            => $"{context.Request.Scheme}://{context.Request.Host}";

        public static string GetBaseAddressWithPath(this HttpContext context)
            => $"{context.Request.Scheme}://{context.Request.Host}{context.Request.Path}";

        public static string GetBaseAddressWithPath(this HttpContext context, string path)
            => $"{context.Request.Scheme}://{context.Request.Host}{path}";

        public static OAuthRequest BuildOAuthRequest(this HttpContext context,
            string token = default, string tokenSecret = default,
            string verifier = default, string callback = default)
            => new OAuthRequest
            {
                OAuthToken = token ?? context.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.Token))?.Value,
                OAuthTokenSecret = tokenSecret ?? context.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.TokenSecret))?.Value,
                OAuthVerifier = verifier,
                OAuthCallback = callback
            };

        public static long CurrentUserUsosId(this HttpContext context)
            => long.TryParse(context?.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.Id))?.Value, out var id) ? id : default;

        public static bool IsCurrentUserParticipant(this HttpContext context)
            => bool.TryParse(context?.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.IsParticipant))?.Value, out var value) ? value : false;

        public static bool IsCurrentUserLecturer(this HttpContext context)
            => bool.TryParse(context?.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.IsLecturer))?.Value, out var value) ? value : false;

        public static bool IsCurrentUserAdmin(this HttpContext context)
            => bool.TryParse(context?.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.IsAdmin))?.Value, out var value) ? value : false;

        public static bool IsCurrentUserCustom(this HttpContext context)
            => bool.TryParse(context?.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.IsCustom))?.Value, out var value) ? value : false;

        public static bool IsCurrentUserEmployee(this HttpContext context)
            => context.IsCurrentUserLecturer() || context.IsCurrentUserAdmin() || context.IsCurrentUserCustom();

        public static CurrentUser GetCurrentUser(this HttpContext context) =>
            new CurrentUser
            {
                Id = context.CurrentUserUsosId(),
                IsParticipant = context.IsCurrentUserParticipant(),
                IsLecturer = context.IsCurrentUserLecturer(),
                IsAdmin = context.IsCurrentUserAdmin(),
                IsCustom = context.IsCurrentUserCustom(),
                IsEmployee = context.IsCurrentUserEmployee()
            };
    }
}
