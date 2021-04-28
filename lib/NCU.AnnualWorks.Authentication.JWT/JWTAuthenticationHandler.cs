using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Options;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Authentication.JWT
{
    public class JWTAuthenticationHandler : AuthenticationHandler<JWTAuthenticationOptions>
    {
        private readonly IJWTAuthenticationService _jwtService;
        public JWTAuthenticationHandler(IOptionsMonitor<JWTAuthenticationOptions> options,
            ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock,
            IJWTAuthenticationService jwtService)
            : base(options, logger, encoder, clock)
        {
            _jwtService = jwtService;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            //TODO: Skip middleware if requesting static files
            var hasAuthorizationHeader = this.Context.Request.Headers.TryGetValue("Authorization", out var authorizationHeader);
            var hasAuthCookie = this.Context.Request.Cookies.TryGetValue(AuthenticationCookies.SecureAuth, out var authCookie);

            if (!hasAuthorizationHeader && !hasAuthCookie)
            {
                return AuthenticateResult.Fail("Authorization missing.");
            }

            var token = hasAuthorizationHeader ? authorizationHeader.FirstOrDefault()?.Split(' ').LastOrDefault() : authCookie;

            if (string.IsNullOrWhiteSpace(token))
            {
                return AuthenticateResult.Fail("Authorization missing.");
            }

            if (!_jwtService.TryValidateJWE(token, out var jwt))
            {
                return AuthenticateResult.Fail("Invalid authorization token.");
            }

            var identity = new ClaimsIdentity(jwt.Claims, nameof(JWTAuthenticationHandler));
            Context.User.AddIdentity(identity);

            var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), this.Scheme.Name);
            return AuthenticateResult.Success(ticket);
        }
    }
}
