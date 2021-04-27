using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.Core.Abstractions;
using NCU.AnnualWorks.Authentication.Core.Constants;
using NCU.AnnualWorks.Integrations.Usos;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;
using System;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Controllers.Auth
{
    [AllowAnonymous]
    [Route("api/auth/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly IOAuthTokenService _tokenService;
        private readonly UsosClientOptions _options;
        private readonly UsosClient _client;
        public AuthenticateController(IOptions<UsosClientOptions> options, UsosClient client, IOAuthTokenService tokenService)
        {
            _options = options.Value;
            _client = client;
            _tokenService = tokenService;
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync()
        {
            var response = await _client.GetRequestTokenAsync(HttpContext);
            if (response.IsSuccessStatusCode)
            {
                var tokenResponse = await _client.ParseRequestTokenResponseAsync(response.Content);
                _tokenService.SetRequestToken(tokenResponse.OAuthToken, tokenResponse.OAuthTokenSecret);
                var baseAddress = new Uri(_options.BaseApiAddress);
                var redirectUri = new Uri(baseAddress, $"{_options.AuthorizeEndpoint}?{OAuthFieldsConsts.OAuthToken}={tokenResponse.OAuthToken}");

                return new OkObjectResult(redirectUri.ToString());
            }

            //TODO: Add logging
            //Something went terribly wrong and USOS did not returned a request token
            return new StatusCodeResult(500);
        }
    }
}
