using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.Core.Options;
using NCU.AnnualWorks.Authentication.Core.Utils;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Authentication
{
    public class JWTAuthenticationHandler : AuthenticationHandler<JWTAuthenticationOptions>
    {
        private readonly JWTAuthenticationOptions _options;
        public JWTAuthenticationHandler(IOptionsMonitor<JWTAuthenticationOptions> options, ILoggerFactory logger,
            UrlEncoder encoder, ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
            _options = options.CurrentValue;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!this.Context.Request.Headers.TryGetValue("Authorization", out var authorizationHeader))
            {
                return AuthenticateResult.Fail("Authorization header missing.");
            }

            var token = authorizationHeader.FirstOrDefault()?.Split(' ').LastOrDefault();

            if (string.IsNullOrWhiteSpace(token))
            {
                return AuthenticateResult.Fail("Authorization token missing.");
            }

            if (!JWTAuthenticationUtils.TryValidateJWT(token, _options.Secret, out var jwt))
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
