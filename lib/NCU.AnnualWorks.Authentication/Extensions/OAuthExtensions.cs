using NCU.AnnualWorks.Authentication.Core.Constants;
using NCU.AnnualWorks.Authentication.Core.Models.OAuth;
using NCU.AnnualWorks.Authentication.Core.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;

namespace NCU.AnnualWorks.Authentication.Extensions
{
    public static class OAuthExtensions
    {
        public static RNGCryptoServiceProvider cryptoRNG = new RNGCryptoServiceProvider();
        public static void AddOAuthAuthorization(this HttpRequestMessage request, OAuthRequest oauthFields)
        {
            var headers = OAuthUtils.GenerateOAuthHeaders(oauthFields);
            var signature = OAuthUtils.GenerateSignature(oauthFields, headers, request);

            request.AddOAuthHeaders(headers, signature);
        }

        private static void AddOAuthHeaders(this HttpRequestMessage request, Dictionary<string, string> headers, string signature)
        {
            var oauthHeaders = headers.Where(kv => kv.Key != OAuthFieldsConsts.OAuthCallback)
                .Select(kv => $"{kv.Key}={kv.Value}").ToList();

            oauthHeaders.Add($"{OAuthFieldsConsts.OAuthSignature}={signature}");
            if (headers.TryGetValue(OAuthFieldsConsts.OAuthCallback, out var callback))
            {
                var callbackHeader = $"{OAuthFieldsConsts.OAuthCallback}={Uri.EscapeDataString(callback)}";
                oauthHeaders.Add(callbackHeader);
            }

            var authorizationHeaderParameters = $"{string.Join(',', oauthHeaders)}";

            request.Headers.Authorization = new AuthenticationHeaderValue(OAuthFieldsConsts.OAuth, authorizationHeaderParameters);
        }
    }
}
