using Microsoft.AspNetCore.Authentication;

namespace NCU.AnnualWorks.Authentication.JWT.Core.Options
{
    public class JWTAuthenticationOptions : AuthenticationSchemeOptions
    {
        public string JWSSigningKey { get; set; }
        public string JWESigningKey { get; set; }
        public string JWEEncryptionKey { get; set; }
    }
}
