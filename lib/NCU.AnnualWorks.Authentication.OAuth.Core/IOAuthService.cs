using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using System.Net.Http;

namespace NCU.AnnualWorks.Authentication.OAuth.Core
{
    public interface IOAuthService
    {
        string Get(string key);
        void Remove(string key);
        void SetRequestToken(string key, string value);
        void SetAccessToken(string key, string value);
        void AddOAuthAuthorizationHeader(HttpRequestMessage request, OAuthRequest oauthFields);
    }
}
