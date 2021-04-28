using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.OAuth.Core;
using NCU.AnnualWorks.Authentication.OAuth.Core.Constants;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Integrations.Usos
{
    public class UsosClient
    {
        private readonly HttpClient _client;
        private readonly UsosClientOptions _options;
        private readonly IOAuthService _oauthService;

        public UsosClient(IOptions<UsosClientOptions> options, IOAuthService oauthService, HttpClient client)
        {
            _options = options.Value;
            _client = client;
            _oauthService = oauthService;

            _client.BaseAddress = new Uri(_options.BaseApiAddress);
            _client.DefaultRequestHeaders.CacheControl = new CacheControlHeaderValue
            {
                NoCache = true
            };
        }

        public Uri GetBaseAddress() => _client.BaseAddress;
        public Uri GetRedirectAddress(string token) =>
            new Uri(_client.BaseAddress, $"{_options.AuthorizeEndpoint}?{OAuthFields.OAuthToken}={token}");

        public Task<HttpResponseMessage> GetRequestTokenAsync(HttpContext context)
        {
            var request = GetBaseRequest(_options.RequestTokenEndpoint);

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthCallback = $"{context.Request.Scheme}://{context.Request.Host}{_options.CallbackEndpoint}";
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            return _client.SendAsync(request);
        }

        public Task<HttpResponseMessage> GetAccessTokenAsync(OAuthRequest oauthRequest)
        {
            var request = GetBaseRequest(_options.AccessTokenEndpoint);

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            oauth.OAuthVerifier = oauthRequest.OAuthVerifier;
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            return _client.SendAsync(request);
        }

        public async Task<OAuthResponse> ParseRequestTokenResponseAsync(HttpContent content)
        {
            var parameters = await ParseTokenResponseAsync(content);

            return new OAuthResponse
            {
                OAuthToken = parameters.GetValueOrDefault(OAuthFields.OAuthToken),
                OAuthTokenSecret = parameters.GetValueOrDefault(OAuthFields.OAuthTokenSecret),
                OAuthCallbackConfirmed = bool.Parse(parameters.GetValueOrDefault(OAuthFields.OAuthCallbackConfirmed))
            };
        }

        public async Task<OAuthResponse> ParseAccessTokenResponseAsync(HttpContent content)
        {
            var parameters = await ParseTokenResponseAsync(content);

            return new OAuthResponse
            {
                OAuthToken = parameters.GetValueOrDefault(OAuthFields.OAuthToken),
                OAuthTokenSecret = parameters.GetValueOrDefault(OAuthFields.OAuthTokenSecret)
            };
        }

        private OAuthRequest GetBaseOAuthRequestFields() =>
            new OAuthRequest
            {
                OAuthConsumerKey = _options.ConsumerKey,
                OAuthConsumerSecret = _options.ConsumerSecret,
                OAuthSignatureMethod = SignatureMethods.HMACSHA1
            };

        private HttpRequestMessage GetBaseRequest(string endpoint)
        {
            var address = new Uri(_client.BaseAddress, endpoint);
            var request = new HttpRequestMessage(HttpMethod.Post, address);
            request.Content = new StringContent(string.Empty);
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");
            return request;
        }

        private async Task<IReadOnlyDictionary<string, string>> ParseTokenResponseAsync(HttpContent content)
        {
            var data = await content.ReadAsStringAsync();
            var keyValuePairs = data.Split('&');
            var parameters = new Dictionary<string, string>();
            foreach (var pair in keyValuePairs)
            {
                var keyValue = pair.Split('=');
                var key = keyValue.FirstOrDefault();
                var value = keyValue.LastOrDefault();
                parameters.Add(key, value);
            }

            return parameters;
        }

    }
}
