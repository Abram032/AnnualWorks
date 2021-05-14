using NCU.AnnualWorks.Authentication.JWT.Core.Enums;

namespace NCU.AnnualWorks.Authentication.JWT.Core.Models
{
    public class AuthClaims
    {
        public string Id { get; set; }
        public AccessType AccessType { get; set; }
        public string Token { get; set; }
        public string TokenSecret { get; set; }
    }
}
