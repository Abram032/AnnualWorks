using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Authentication.OAuth.Core;
using NCU.AnnualWorks.Integrations.Usos;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Controllers.Auth
{
    [AllowAnonymous]
    [Route("api/auth/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UsosClient _client;
        private readonly IOAuthService _oauthService;
        public AuthenticateController(UsosClient client, IOAuthService oauthService)
        {
            _client = client;
            _oauthService = oauthService;
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync()
        {
            var response = await _client.GetRequestTokenAsync(HttpContext);
            if (response.IsSuccessStatusCode)
            {
                var tokenResponse = await _client.ParseRequestTokenResponseAsync(response.Content);
                _oauthService.SetRequestToken(tokenResponse.OAuthToken, tokenResponse.OAuthTokenSecret);

                return new OkObjectResult(_client.GetRedirectAddress(tokenResponse.OAuthToken).ToString());
            }

            //TODO: Add logging
            //Something went terribly wrong and USOS did not returned a request token
            return new StatusCodeResult(500);
        }
    }
}
