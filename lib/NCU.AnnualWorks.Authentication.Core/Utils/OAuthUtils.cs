using NCU.AnnualWorks.Authentication.Core.Constants;
using NCU.AnnualWorks.Authentication.Core.Models.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;

namespace NCU.AnnualWorks.Authentication.Core.Utils
{
    public static class OAuthUtils
    {
        private static RNGCryptoServiceProvider cryptoRNG = new RNGCryptoServiceProvider();
        public static string GenerateNonce(int length = 8)
        {
            var bytes = new byte[length];
            cryptoRNG.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        public static string GetTimestamp()
            => DateTimeOffset.Now.ToUnixTimeSeconds().ToString();

        public static Dictionary<string, string> GenerateOAuthHeaders(OAuthRequest oauthFields)
        {
            var headers = new Dictionary<string, string>();

            headers.Add(OAuthFieldsConsts.OAuthConsumerKey, oauthFields.OAuthConsumerKey);
            headers.Add(OAuthFieldsConsts.OAuthSignatureMethod, oauthFields.OAuthSignatureMethod);
            headers.Add(OAuthFieldsConsts.OAuthTimestamp, GetTimestamp());
            headers.Add(OAuthFieldsConsts.OAuthNonce, GenerateNonce());
            headers.Add(OAuthFieldsConsts.OAuthVersion, "1.0");

            if (!string.IsNullOrWhiteSpace(oauthFields.OAuthToken))
            {
                headers.Add(OAuthFieldsConsts.OAuthToken, oauthFields.OAuthToken);
            }

            if (!string.IsNullOrWhiteSpace(oauthFields.OAuthVerifier))
            {
                headers.Add(OAuthFieldsConsts.OAuthVerifier, oauthFields.OAuthVerifier);
            }

            if (!string.IsNullOrWhiteSpace(oauthFields.OAuthCallback))
            {
                headers.Add(OAuthFieldsConsts.OAuthCallback, oauthFields.OAuthCallback);
            }

            return headers;
        }

        public static string GenerateSignature(OAuthRequest oauthFields, Dictionary<string, string> headers, HttpRequestMessage request)
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

        public static string CreateBaseString(Dictionary<string, string> headers, HttpRequestMessage request)
        {
            var method = request.Method;
            var uri = CreateBaseUri(request);
            var parameters = CreateParameterString(headers, request.RequestUri.Query);
            return $"{method}&{Uri.EscapeDataString(uri)}&{Uri.EscapeDataString(parameters)}";
        }

        public static string CreateBaseUri(HttpRequestMessage request)
            => $"{request.RequestUri.Scheme}://{request.RequestUri.Host}{request.RequestUri.AbsolutePath}";

        public static string CreateParameterString(Dictionary<string, string> headers, string query)
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
    }
}
