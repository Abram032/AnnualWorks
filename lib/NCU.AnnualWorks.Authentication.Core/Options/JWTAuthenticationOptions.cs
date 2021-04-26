using Microsoft.AspNetCore.Authentication;

namespace NCU.AnnualWorks.Authentication.Core.Options
{
    public class JWTAuthenticationOptions : AuthenticationSchemeOptions
    {
        public string Secret { get; set; }
    }
}
