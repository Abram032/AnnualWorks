using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.Core.Constants;
using NCU.AnnualWorks.Authentication.Core.Models.OAuth;
using NCU.AnnualWorks.Authentication.Extensions;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;
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

        public UsosClient(IOptions<UsosClientOptions> options, HttpClient client)
        {
            _options = options.Value;
            _client = client;

            _client.BaseAddress = new Uri(_options.BaseApiAddress);
        }

        private OAuthRequest GetBaseOAuthRequestFields() =>
            new OAuthRequest
            {
                OAuthConsumerKey = _options.ConsumerKey,
                OAuthConsumerSecret = _options.ConsumerSecret,
                OAuthSignatureMethod = SignatureMethods.HMACSHA1
            };

        private HttpRequestMessage GetBaseRequest(HttpContext context, string endpoint)
        {
            var address = new Uri(_client.BaseAddress, endpoint);
            var request = new HttpRequestMessage(HttpMethod.Post, address);
            request.Content = new StringContent(string.Empty);
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");
            return request;
        }

        public Task<HttpResponseMessage> GetRequestTokenAsync(HttpContext context)
        {
            var request = GetBaseRequest(context, _options.RequestTokenEndpoint);

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthCallback = $"{context.Request.Scheme}://{context.Request.Host}{_options.CallbackEndpoint}";
            request.AddOAuthAuthorization(oauth);

            return _client.SendAsync(request);
        }

        public Task<HttpResponseMessage> GetAccessTokenAsync(HttpContext context, OAuthRequest oauthRequest)
        {
            var request = GetBaseRequest(context, _options.AccessTokenEndpoint);

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            oauth.OAuthVerifier = oauthRequest.OAuthVerifier;
            request.AddOAuthAuthorization(oauth);

            return _client.SendAsync(request);
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

        public async Task<OAuthResponse> ParseRequestTokenResponseAsync(HttpContent content)
        {
            var parameters = await ParseTokenResponseAsync(content);

            return new OAuthResponse
            {
                OAuthToken = parameters.GetValueOrDefault(OAuthFieldsConsts.OAuthToken),
                OAuthTokenSecret = parameters.GetValueOrDefault(OAuthFieldsConsts.OAuthTokenSecret),
                OAuthCallbackConfirmed = bool.Parse(parameters.GetValueOrDefault(OAuthFieldsConsts.OAuthCallbackConfirmed))
            };
        }

        public async Task<OAuthResponse> ParseAccessTokenResponseAsync(HttpContent content)
        {
            var parameters = await ParseTokenResponseAsync(content);

            return new OAuthResponse
            {
                OAuthToken = parameters.GetValueOrDefault(OAuthFieldsConsts.OAuthToken),
                OAuthTokenSecret = parameters.GetValueOrDefault(OAuthFieldsConsts.OAuthTokenSecret)
            };
        }
    }
}
