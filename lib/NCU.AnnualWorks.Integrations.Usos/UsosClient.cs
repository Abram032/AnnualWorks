using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.Core.Constants;
using NCU.AnnualWorks.Authentication.Core.Models;
using NCU.AnnualWorks.Authentication.Extensions;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;
using System;
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

        private OAuthFields GetBaseOAuthFields() =>
            new OAuthFields
            {
                OAuthConsumerKey = _options.ConsumerKey,
                OAuthConsumerSecret = _options.ConsumerSecret,
                OAuthSignatureMethod = SignatureMethods.HMACSHA1
            };

        public Task<HttpResponseMessage> GetRequestTokenAsync(HttpContext context)
        {
            var address = new Uri(_client.BaseAddress, _options.RequestTokenEndpoint);
            var request = new HttpRequestMessage(HttpMethod.Post, address);
            request.Content = new StringContent(string.Empty);
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");

            var oauth = GetBaseOAuthFields();
            oauth.OAuthCallback = $"{context.Request.Scheme}://{context.Request.Host}{_options.CallbackEndpoint}";

            request.AddOAuthAuthorization(oauth);

            return _client.SendAsync(request);
        }
    }
}
