using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using System.Net.Http;

namespace NCU.AnnualWorks.Authentication.OAuth.Core
{
    public interface IOAuthService
    {
        void AddOAuthAuthorizationHeader(HttpRequestMessage request, OAuthRequest oauthFields);
    }
}
