using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
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
        private readonly IUserContext _userContext;

        public JWTAuthenticationHandler(IOptionsMonitor<JWTAuthenticationOptions> options,
            ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock,
            IJWTAuthenticationService jwtService, IUserContext userContext)
            : base(options, logger, encoder, clock)
        {
            _jwtService = jwtService;
            _userContext = userContext;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            //TODO: Skip middleware if requesting static files
            var hasAuthorizationHeader = this.Context.Request.Headers.TryGetValue("Authorization", out var authorizationHeader);
            var hasAuthCookie = this.Context.Request.Cookies.TryGetValue(AuthenticationCookies.SecureAuth, out var authCookie);
            var hasTokenCookie = this.Context.Request.Cookies.TryGetValue(AuthenticationCookies.SecureToken, out var tokenCookie);
            var hasUserCookie = this.Context.Request.Cookies.TryGetValue(AuthenticationCookies.SecureUser, out var userCookie);

            if (!hasAuthorizationHeader && !hasAuthCookie && !hasTokenCookie)
            {
                return AuthenticateResult.Fail("Authorization missing.");
            }

            var token = string.Empty;
            if (hasAuthorizationHeader)
            {
                token = authorizationHeader.FirstOrDefault()?.Split(' ').LastOrDefault();
            }
            else if (hasAuthCookie)
            {
                token = authCookie;
            }
            else if (hasTokenCookie)
            {
                token = tokenCookie;
            }

            if (string.IsNullOrWhiteSpace(token))
            {
                return AuthenticateResult.Fail("Authorization missing.");
            }

            if (!_jwtService.TryValidateJWE(token, out var jwt) || (!string.IsNullOrEmpty(userCookie) && !_jwtService.TryValidateJWS(userCookie, out var userJwt)))
            {
                Response.Cookies.Delete(AuthenticationCookies.SecureAuth, _jwtService.GetAuthCookieOptions());
                Response.Cookies.Delete(AuthenticationCookies.SecureUser, _jwtService.GetUserCookieOptions());
                Response.Cookies.Delete(AuthenticationCookies.SecureToken, _jwtService.GetTokenCookieOptions());
                return AuthenticateResult.Fail("Invalid authorization token.");
            }

            var identity = new ClaimsIdentity(jwt.Claims, nameof(JWTAuthenticationHandler));
            Context.User.AddIdentity(identity);
            _userContext.SetCurrentUser(Context);

            var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), this.Scheme.Name);
            return AuthenticateResult.Success(ticket);
        }
    }
}
