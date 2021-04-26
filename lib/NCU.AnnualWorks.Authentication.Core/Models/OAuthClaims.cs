using NCU.AnnualWorks.Authentication.Core.Enums;

namespace NCU.AnnualWorks.Authentication.Core.Models
{
    public class OAuthClaims
    {
        public long Id { get; set; }
        public UserType UserType { get; set; }
        public string Token { get; set; }
    }
}
