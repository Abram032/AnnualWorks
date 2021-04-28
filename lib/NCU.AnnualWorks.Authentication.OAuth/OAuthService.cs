using Microsoft.Extensions.Caching.Memory;
using NCU.AnnualWorks.Authentication.OAuth.Core;
using NCU.AnnualWorks.Authentication.OAuth.Core.Constants;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;

namespace NCU.AnnualWorks.Authentication.OAuth
{
    public class OAuthService : IOAuthService
    {
        private readonly RNGCryptoServiceProvider cryptoRNG;
        private readonly IMemoryCache _cache;

        public OAuthService(IMemoryCache cache)
        {
            _cache = cache;

            cryptoRNG = new RNGCryptoServiceProvider();
        }

        public string Get(string key)
        {
            if (_cache.TryGetValue<string>(key, out var value))
            {
                return value;
            }

            return null;
        }

        public void Remove(string key) => _cache.Remove(key);

        public void SetRequestToken(string key, string value)
        {
            _cache.Set(key, value, new MemoryCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
            });
        }

        public void SetAccessToken(string key, string value)
        {
            _cache.Set(key, value, new MemoryCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(90)
            });
        }

        public string GenerateNonce(int length = 8)
        {
            var bytes = new byte[length];
            cryptoRNG.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        public string GetTimestamp() => DateTimeOffset.Now.ToUnixTimeSeconds().ToString();

        public Dictionary<string, string> GenerateOAuthHeaders(OAuthRequest oauthFields)
        {
            var headers = new Dictionary<string, string>();

            headers.Add(OAuthFields.OAuthConsumerKey, oauthFields.OAuthConsumerKey);
            headers.Add(OAuthFields.OAuthSignatureMethod, SignatureMethods.HMACSHA1);
            headers.Add(OAuthFields.OAuthTimestamp, GetTimestamp());
            headers.Add(OAuthFields.OAuthNonce, GenerateNonce());
            headers.Add(OAuthFields.OAuthVersion, "1.0");

            if (!string.IsNullOrWhiteSpace(oauthFields.OAuthToken))
            {
                headers.Add(OAuthFields.OAuthToken, oauthFields.OAuthToken);
            }

            if (!string.IsNullOrWhiteSpace(oauthFields.OAuthVerifier))
            {
                headers.Add(OAuthFields.OAuthVerifier, oauthFields.OAuthVerifier);
            }

            if (!string.IsNullOrWhiteSpace(oauthFields.OAuthCallback))
            {
                headers.Add(OAuthFields.OAuthCallback, oauthFields.OAuthCallback);
            }

            return headers;
        }

        public string GenerateSignature(OAuthRequest oauthFields, Dictionary<string, string> headers, HttpRequestMessage request)
        {
            var baseString = CreateBaseString(headers, request);
            var encodedConsumerSecret = Uri.EscapeDataString(oauthFields.OAuthConsumerSecret);
            var encodedTokenSecret = !string.IsNullOrWhiteSpace(oauthFields.OAuthTokenSecret) ?
                Uri.EscapeDataString(oauthFields.OAuthTokenSecret) : string.Empty;
            var key = $"{encodedConsumerSecret}&{encodedTokenSecret}";

            using (var hmac = new HMACSHA1(Encoding.UTF8.GetBytes(key)))
            {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(baseString));
                return Convert.ToBase64String(hash);
            }
        }

        public string CreateBaseString(Dictionary<string, string> headers, HttpRequestMessage request)
        {
            var method = request.Method;
            var uri = CreateBaseUri(request);
            var parameters = CreateParameterString(headers, request.RequestUri.Query);
            return $"{method}&{Uri.EscapeDataString(uri)}&{Uri.EscapeDataString(parameters)}";
        }

        public string CreateBaseUri(HttpRequestMessage request)
            => $"{request.RequestUri.Scheme}://{request.RequestUri.Host}{request.RequestUri.AbsolutePath}";

        public string CreateParameterString(Dictionary<string, string> headers, string query)
        {
            var encodedParameters = new SortedDictionary<string, string>();

            if (query.StartsWith('?'))
            {
                query = query.Substring(1);
            }

            if (!string.IsNullOrWhiteSpace(query))
            {
                var parameters = query.Split('&');
                foreach (var parameter in parameters)
                {
                    var keyValuePair = parameter.Split('=');
                    var encodedKey = Uri.EscapeDataString(keyValuePair[0]);
                    var encodedValue = Uri.EscapeDataString(keyValuePair[1]);
                    encodedParameters.Add(encodedKey, encodedValue);
                }
            }

            foreach (var keyValuePair in headers)
            {
                var encodedKey = Uri.EscapeDataString(keyValuePair.Key);
                var encodedValue = Uri.EscapeDataString(keyValuePair.Value);
                encodedParameters.Add(encodedKey, encodedValue);
            }

            return string.Join('&', encodedParameters.Select(kv => $"{kv.Key}={kv.Value}"));
        }

        public void AddOAuthAuthorizationHeader(HttpRequestMessage request, OAuthRequest oauthFields)
        {
            var headers = GenerateOAuthHeaders(oauthFields);
            var signature = GenerateSignature(oauthFields, headers, request);

            var oauthHeaders = headers.Where(kv => kv.Key != OAuthFields.OAuthCallback)
                .Select(kv => $"{kv.Key}={kv.Value}").ToList();

            oauthHeaders.Add($"{OAuthFields.OAuthSignature}={signature}");
            if (headers.TryGetValue(OAuthFields.OAuthCallback, out var callback))
            {
                var callbackHeader = $"{OAuthFields.OAuthCallback}={Uri.EscapeDataString(callback)}";
                oauthHeaders.Add(callbackHeader);
            }

            var authorizationHeaderParameters = $"{string.Join(',', oauthHeaders)}";

            request.Headers.Authorization = new AuthenticationHeaderValue(OAuthFields.OAuth, authorizationHeaderParameters);

            return;
        }
    }
}
