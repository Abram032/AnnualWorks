using NCU.AnnualWorks.Authentication.Core.Enums;

namespace NCU.AnnualWorks.Authentication.Core.Models.Claims
{
    public class AuthClaims
    {
        public long Id { get; set; }
        public UserType UserType { get; set; }
        public string Token { get; set; }
    }
}
