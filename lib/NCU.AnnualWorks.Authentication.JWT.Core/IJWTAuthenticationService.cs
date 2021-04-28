using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace NCU.AnnualWorks.Authentication.JWT.Core
{
    public interface IJWTAuthenticationService
    {
        ClaimsIdentity GenerateClaimsIdentity(AuthClaims claims);
        ClaimsIdentity GenerateClaimsIdentity(UserClaims claims);
        string GenerateJWS(ClaimsIdentity claimsIdentity);
        string GenerateJWE(ClaimsIdentity claimsIdentity);
        bool TryValidateJWS(string token, out JwtSecurityToken jwt);
        bool TryValidateJWE(string token, out JwtSecurityToken jwt);
    }
}
