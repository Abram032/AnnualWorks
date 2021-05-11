using Microsoft.AspNetCore.Http;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using System.Linq;

namespace NCU.AnnualWorks.Core.Extensions
{
    public static class HttpContextExtensions
    {
        public static string GetBaseAddress(this HttpContext context)
            => $"{context.Request.Scheme}://{context.Request.Host}";

        public static string GetBaseAddressWithPath(this HttpContext context)
            => $"{context.Request.Scheme}://{context.Request.Host}{context.Request.Path}";

        public static OAuthRequest BuildOAuthRequest(this HttpContext context)
            => new OAuthRequest
            {
                OAuthToken = context.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.Token))?.Value,
                OAuthTokenSecret = context.User?.Claims?.FirstOrDefault(c => c.Type == nameof(AuthClaims.TokenSecret))?.Value
            };
    }
}
