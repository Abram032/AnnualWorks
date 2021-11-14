using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Authentication.OAuth.Core;
using NCU.AnnualWorks.Authentication.OAuth.Core.Constants;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Repositories;
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
        private readonly IAsyncRepository<Settings> _settingsRepository;
        private readonly IUserContext _userContext;

        public UsosService(IOptions<UsosServiceOptions> options, IOAuthService oauthService,
            HttpClient client, ILogger<UsosService> logger, IAsyncRepository<Settings> settingsRepository,
            IUserContext userContext)
        {
            _logger = logger;
            _options = options.Value;
            _client = client;
            _oauthService = oauthService;
            _settingsRepository = settingsRepository;
            _userContext = userContext;

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
        public string GetCourseCode() => _settingsRepository.GetAll().FirstOrDefault()?.CourseCode;

        private async Task<HttpResponseMessage> SendRequestAsync(HttpRequestMessage request)
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

            return response;
            //throw new UsosConnectionException("Could not connect to USOS.");
        }

        private void AppendOAuthConsumer(OAuthRequest oauthRequest)
        {
            oauthRequest.OAuthConsumerKey = _options.ConsumerKey;
            oauthRequest.OAuthConsumerSecret = _options.ConsumerSecret;
            oauthRequest.OAuthSignatureMethod = SignatureMethods.HMACSHA1;
        }

        private HttpRequestMessage GetBaseRequest(OAuthRequest oauthRequest, string endpoint)
        {
            var address = new Uri(_client.BaseAddress, endpoint);
            var request = new HttpRequestMessage(HttpMethod.Post, address);
            request.Content = new StringContent(string.Empty);
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");

            AppendOAuthConsumer(oauthRequest);
            _oauthService.AddOAuthAuthorizationHeader(request, oauthRequest);

            return request;
        }

        private async Task<OAuthResponse> ParseTokenResponseAsync(HttpContent content)
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

            return new OAuthResponse
            {
                OAuthToken = parameters.GetValueOrDefault(OAuthFields.OAuthToken),
                OAuthTokenSecret = parameters.GetValueOrDefault(OAuthFields.OAuthTokenSecret)
            };
        }

        public async Task<OAuthResponse> GetRequestTokenAsync(OAuthRequest oauthRequest)
        {
            var scopes = _options.DefaultScopes.ToScopes();
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.RequestToken}?scopes={scopes}");

            var response = await SendRequestAsync(request);

            return await ParseTokenResponseAsync(response.Content);
        }

        public async Task<OAuthResponse> GetAccessTokenAsync(OAuthRequest oauthRequest)
        {
            var request = GetBaseRequest(oauthRequest, _options.UsosEndpoints.AccessToken);

            var response = await SendRequestAsync(request);

            return await ParseTokenResponseAsync(response.Content);
        }

        public async Task RevokeAccessTokenAsync(OAuthRequest oauthRequest)
        {
            var request = GetBaseRequest(oauthRequest, _options.UsosEndpoints.RevokeToken);

            await SendRequestAsync(request);
        }

        public async Task<UsosUser> GetCurrentUser(OAuthRequest oauthRequest)
        {
            var fields = _options.UsosFields.Users.ToFields();
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.UsersUser}?fields={fields}");

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var user = JsonConvert.DeserializeObject<UsosUser>(value);

            return user;
        }

        public async Task<UsosUser> GetUser(OAuthRequest oauthRequest, string userId)
        {
            var fields = _options.UsosFields.Users.ToFields();
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.UsersUser}?user_id={userId}&fields={fields}");

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var user = JsonConvert.DeserializeObject<UsosUser>(value);

            return user;
        }

        public async Task<List<UsosUser>> GetUsers(OAuthRequest oauthRequest, IEnumerable<string> userIds)
        {
            var fields = _options.UsosFields.Users.ToFields();
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.UsersUsers}?user_ids={userIds.ToFields()}&fields={fields}");

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var users = JsonConvert.DeserializeObject<Dictionary<string, UsosUser>>(value);

            return users.Values.ToList();
        }

        public async Task<List<UsosTerm>> GetTerms(OAuthRequest oauthRequest)
        {
            var today = DateTime.Today.ToString(_options.DateFormatPattern);
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.TermsSearch}");

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var terms = JsonConvert.DeserializeObject<UsosTerm[]>(value);

            var pattern = @"^\d{4}\/\d{2}(Z|L)?$"; //Ex. 2020/21Z or 2020/21

            return terms.Where(t => Regex.IsMatch(t.Id, pattern)).ToList();
        }

        public async Task<UsosTerm> GetTerm(OAuthRequest oauthRequest, string termId)
        {
            var today = DateTime.Today.ToString(_options.DateFormatPattern);
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.TermsTerm}?term_id={termId}");

            var response = await SendRequestAsync(request);
            var value = await response.Content.ReadAsStringAsync();
            var term = JsonConvert.DeserializeObject<UsosTerm>(value);

            return term;
        }

        public async Task<UsosTerm> GetCurrentTerm(OAuthRequest oauthRequest)
        {
            var today = DateTime.Today.ToString(_options.DateFormatPattern);
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.TermsSearch}?min_finish_date={today}&max_start_date={today}");

            var response = await SendRequestAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var value = await response.Content.ReadAsStringAsync();
            var terms = JsonConvert.DeserializeObject<UsosTerm[]>(value);

            var pattern = @"^\d{4}\/\d{2}(Z|L)?$"; //Ex. 2020/21Z or 2020/21
            var term = terms.Where(t => Regex.IsMatch(t.Id, pattern)).FirstOrDefault();

            return term;
        }

        public async Task<bool?> IsCurrentUserCourseParticipant(OAuthRequest oauthRequest, string termId)
        {
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.CoursesIsParticipant}?course_id={GetCourseCode()}&term_id={termId}");

            var response = await SendRequestAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var value = await response.Content.ReadAsStringAsync();
            return Convert.ToBoolean(int.Parse(value));
        }

        public async Task<bool?> IsCurrentUserCourseLecturer(OAuthRequest oauthRequest, string termId)
        {
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.CoursesIsLecturer}?course_id={GetCourseCode()}&term_id={termId}");

            var response = await SendRequestAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var value = await response.Content.ReadAsStringAsync();
            return Convert.ToBoolean(int.Parse(value));
        }

        public async Task<bool?> IsCurrentUserCourseCoordinator(OAuthRequest oauthRequest, string termId)
        {
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.CoursesIsCoordinator}?course_id={GetCourseCode()}&term_id={termId}");

            var response = await SendRequestAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var value = await response.Content.ReadAsStringAsync();
            return Convert.ToBoolean(int.Parse(value));
        }

        private async Task<List<UsosUser>> GetCourseEditionUsers(OAuthRequest oauthRequest, string termId, string field)
        {
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.CoursesCourseEdition}?course_id={GetCourseCode()}&term_id={termId}&fields={field}");

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

        public async Task<bool> CourseExists(OAuthRequest oauthRequest, string courseId, string termId)
        {
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.CoursesCourse}?course_id={courseId}");
            //Custom call in case of bad request => course doesn't exist
            var response = await _client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                return true;
            }

            return false;
        }

        public async Task<string> GetCourseUrl(OAuthRequest oauthRequest, string courseId)
        {
            var field = "profile_url";
            var request = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.CoursesCourse}?course_id={courseId}&fields={field}");
            var response = await SendRequestAsync(request);

            var data = await response.Content.ReadAsStringAsync();
            var url = JsonConvert.DeserializeObject<Dictionary<string, string>>(data).GetValueOrDefault(field);

            return url;
        }

        public async Task<List<UsosUser>> SearchUsers(OAuthRequest oauthRequest, string userQuery)
        {
            var fields = "items[user[id]]";
            var searchRequest = GetBaseRequest(oauthRequest, $"{_options.UsosEndpoints.UsersSearch}?lang=pl&fields={fields}&query={userQuery}");
            var searchResponse = await SendRequestAsync(searchRequest);

            var searchData = await searchResponse.Content.ReadAsStringAsync();
            var userIds = JsonConvert.DeserializeObject<UsosUserSearchResponse>(searchData).Items.Select(i => i.User.Id).ToList();

            var users = await GetUsers(oauthRequest, userIds);

            return users;
        }

        public async Task<UsosTerm> GetCurrentAcademicYear()
        {
            var today = DateTime.Today.ToString(_options.DateFormatPattern);
            var request = GetBaseRequest(_userContext.GetCredentials(), $"{_options.UsosEndpoints.TermsSearch}?min_finish_date={today}&max_start_date={today}");

            var response = await SendRequestAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var value = await response.Content.ReadAsStringAsync();
            var terms = JsonConvert.DeserializeObject<UsosTerm[]>(value);

            var pattern = @"^\d{4}\/\d{2}$"; //Ex. 2020/21
            var term = terms.Where(t => Regex.IsMatch(t.Id, pattern)).FirstOrDefault();

            return term;
        }
    }
}
