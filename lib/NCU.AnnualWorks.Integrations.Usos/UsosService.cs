﻿using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.OAuth.Core;
using NCU.AnnualWorks.Authentication.OAuth.Core.Constants;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Core;
using NCU.AnnualWorks.Integrations.Usos.Core.Exceptions;
using NCU.AnnualWorks.Integrations.Usos.Core.Extensions;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Integrations.Usos
{
    public class UsosService : IUsosService
    {
        private readonly HttpClient _client;
        private readonly UsosServiceOptions _options;
        private readonly IOAuthService _oauthService;
        private readonly ILogger _logger;

        public UsosService(IOptions<UsosServiceOptions> options, IOAuthService oauthService,
            HttpClient client, ILogger<UsosService> logger)
        {
            _logger = logger;
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
            new Uri(_client.BaseAddress, $"{_options.UsosEndpoints.Authorize}?{OAuthFields.OAuthToken}={token}");
        public Uri GetLogoutAddress() => new Uri(_options.LogoutAddress);

        private async Task<HttpResponseMessage> SendRequestAsync(HttpRequestMessage request)
        {
            //TODO: Replace with polly retry policy
            var retryCount = 10;
            for (int i = 0; i < retryCount; i++)
            {
                var response = await _client.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    return response;
                }
                else if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    throw new UsosUnauthorizedException("USOS could not authorize request.");
                }
                else
                {
                    _logger.LogWarning($"Could not connect to USOS. {response.StatusCode} - {response.ReasonPhrase}", request, response);
                }
                //Wait before retry
                await Task.Delay(1000);
            }

            throw new UsosConnectionException("Could not connect to USOS.");
        }

        private OAuthRequest GetBaseOAuthRequestFields() =>
            new OAuthRequest
            {
                OAuthConsumerKey = _options.ConsumerKey,
                OAuthConsumerSecret = _options.ConsumerSecret,
                OAuthSignatureMethod = SignatureMethods.HMACSHA1
            };

        private void AppendOAuthConsumerFields(OAuthRequest oauthRequest)
        {
            var baseRequest = GetBaseOAuthRequestFields();
            oauthRequest.OAuthConsumerKey = _options.ConsumerKey;
            oauthRequest.OAuthConsumerSecret = _options.ConsumerSecret;
            oauthRequest.OAuthSignatureMethod = SignatureMethods.HMACSHA1;
        }

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

        private async Task<OAuthResponse> ParseRequestTokenResponseAsync(HttpContent content)
        {
            var parameters = await ParseTokenResponseAsync(content);

            return new OAuthResponse
            {
                OAuthToken = parameters.GetValueOrDefault(OAuthFields.OAuthToken),
                OAuthTokenSecret = parameters.GetValueOrDefault(OAuthFields.OAuthTokenSecret),
                OAuthCallbackConfirmed = bool.Parse(parameters.GetValueOrDefault(OAuthFields.OAuthCallbackConfirmed))
            };
        }

        private async Task<OAuthResponse> ParseAccessTokenResponseAsync(HttpContent content)
        {
            var parameters = await ParseTokenResponseAsync(content);

            return new OAuthResponse
            {
                OAuthToken = parameters.GetValueOrDefault(OAuthFields.OAuthToken),
                OAuthTokenSecret = parameters.GetValueOrDefault(OAuthFields.OAuthTokenSecret)
            };
        }

        public async Task<OAuthResponse> GetRequestTokenAsync(HttpContext context)
        {
            var scopes = _options.DefaultScopes.ToScopes();
            var request = GetBaseRequest($"{_options.UsosEndpoints.RequestToken}?scopes={scopes}");

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthCallback = $"{context.Request.Scheme}://{context.Request.Host}{_options.CallbackEndpoint}";
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            var response = await SendRequestAsync(request);

            return await ParseRequestTokenResponseAsync(response.Content);
        }

        public async Task<OAuthResponse> GetAccessTokenAsync(OAuthRequest oauthRequest)
        {
            var request = GetBaseRequest(_options.UsosEndpoints.AccessToken);

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            oauth.OAuthVerifier = oauthRequest.OAuthVerifier;
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            var response = await SendRequestAsync(request);

            return await ParseAccessTokenResponseAsync(response.Content);
        }

        public async Task RevokeAccessTokenAsync(OAuthRequest oauthRequest)
        {
            var request = GetBaseRequest(_options.UsosEndpoints.RevokeToken);

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            await SendRequestAsync(request);
        }

        public async Task<UsosUser> GetCurrentUser(OAuthRequest oauthRequest)
        {
            //var scopeArray = new[] { UserScopes.Id, UserScopes.FirstName, UserScopes.LastName, UserScopes.PhotoUrls };
            var fields = _options.UsosFields.Users.ToFields();
            var request = GetBaseRequest($"{_options.UsosEndpoints.UsersUser}?fields={fields}");

            //TOOD: Figure out a way for adding headers in middleware/delegating handler
            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var user = JsonConvert.DeserializeObject<UsosUser>(value);

            return user;
        }

        public async Task<UsosUser> GetUser(OAuthRequest oauthRequest, string userId)
        {
            var fields = _options.UsosFields.Users.ToFields();
            var request = GetBaseRequest($"{_options.UsosEndpoints.UsersUser}?user_id={userId}&fields={fields}");

            AppendOAuthConsumerFields(oauthRequest);
            _oauthService.AddOAuthAuthorizationHeader(request, oauthRequest);

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var user = JsonConvert.DeserializeObject<UsosUser>(value);

            return user;
        }

        public async Task<List<UsosUser>> GetUsers(OAuthRequest oauthRequest, List<string> userIds)
        {
            var fields = _options.UsosFields.Users.ToFields();
            var request = GetBaseRequest($"{_options.UsosEndpoints.UsersUsers}?user_ids={userIds.ToFields()}&fields={fields}");

            AppendOAuthConsumerFields(oauthRequest);
            _oauthService.AddOAuthAuthorizationHeader(request, oauthRequest);

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var users = JsonConvert.DeserializeObject<Dictionary<string, UsosUser>>(value);

            return users.Values.ToList();
        }

        public async Task<List<UsosTerm>> GetTerms(OAuthRequest oauthRequest)
        {
            var today = DateTime.Today.ToString(_options.DateFormatPattern);
            var request = GetBaseRequest($"{_options.UsosEndpoints.TermsSearch}");

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var terms = JsonConvert.DeserializeObject<UsosTerm[]>(value);

            var pattern = @"^\d{4}\/\d{2}(Z|L)$"; //Ex. 2020/21Z

            return terms.Where(t => Regex.IsMatch(t.Id, pattern)).ToList();
        }

        public async Task<UsosTerm> GetTerm(OAuthRequest oauthRequest, string termId)
        {
            var today = DateTime.Today.ToString(_options.DateFormatPattern);
            var request = GetBaseRequest($"{_options.UsosEndpoints.TermsTerm}?term_id={termId}");

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var term = JsonConvert.DeserializeObject<UsosTerm>(value);

            return term;
        }

        public async Task<UsosTerm> GetCurrentTerm(OAuthRequest oauthRequest)
        {
            var today = DateTime.Today.ToString(_options.DateFormatPattern);
            var request = GetBaseRequest($"{_options.UsosEndpoints.TermsSearch}?min_finish_date={today}&max_start_date={today}");

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var terms = JsonConvert.DeserializeObject<UsosTerm[]>(value);

            var pattern = @"^\d{4}\/\d{2}(Z|L)$"; //Ex. 2020/21Z
            var term = terms.Where(t => Regex.IsMatch(t.Id, pattern)).FirstOrDefault();

            return term;
        }

        public async Task<bool> IsCurrentUserCourseParticipant(OAuthRequest oauthRequest, string termId)
        {
            var request = GetBaseRequest($"{_options.UsosEndpoints.CoursesIsParticipant}?course_id={_options.CourseCode}&term_id={termId}");

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();

            return Convert.ToBoolean(int.Parse(value));
        }

        public async Task<bool> IsCurrentUserCourseLecturer(OAuthRequest oauthRequest, string termId)
        {
            var request = GetBaseRequest($"{_options.UsosEndpoints.CoursesIsLecturer}?course_id={_options.CourseCode}&term_id={termId}");

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();

            return Convert.ToBoolean(int.Parse(value));
        }

        public async Task<bool> IsCurrentUserCourseCoordinator(OAuthRequest oauthRequest, string termId)
        {
            var request = GetBaseRequest($"{_options.UsosEndpoints.CoursesIsCoordinator}?course_id={_options.CourseCode}&term_id={termId}");

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();

            return Convert.ToBoolean(int.Parse(value));
        }

        private async Task<List<UsosUser>> GetCourseEditionUsers(OAuthRequest oauthRequest, string termId, string field)
        {
            var request = GetBaseRequest($"{_options.UsosEndpoints.CoursesCourseEdition}?course_id={_options.CourseCode}&term_id={termId}&fields={field}");

            var oauth = GetBaseOAuthRequestFields();
            oauth.OAuthToken = oauthRequest.OAuthToken;
            oauth.OAuthTokenSecret = oauthRequest.OAuthTokenSecret;
            _oauthService.AddOAuthAuthorizationHeader(request, oauth);

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var users = JsonConvert.DeserializeObject<Dictionary<string, UsosUser[]>>(value);

            return users.GetValueOrDefault(field).ToList();
        }

        public Task<List<UsosUser>> GetCourseEditionParticipants(OAuthRequest oauthRequest, string termId)
        {
            return GetCourseEditionUsers(oauthRequest, termId, "participants");
        }

        public Task<List<UsosUser>> GetCourseEditionLecturers(OAuthRequest oauthRequest, string termId)
        {
            return GetCourseEditionUsers(oauthRequest, termId, "lecturers");
        }

        public Task<List<UsosUser>> GetCourseEditionCoordinators(OAuthRequest oauthRequest, string termId)
        {
            return GetCourseEditionUsers(oauthRequest, termId, "coordinators");
        }
    }
}
