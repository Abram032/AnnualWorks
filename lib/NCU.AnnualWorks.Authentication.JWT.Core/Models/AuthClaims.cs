using NCU.AnnualWorks.Authentication.JWT.Core.Enums;

namespace NCU.AnnualWorks.Authentication.JWT.Core.Models
{
    public class AuthClaims
    {
        public long Id { get; set; }
        public AccessType AccessType { get; set; }
        public string Token { get; set; }
        public string TokenSecret { get; set; }
    }
}
