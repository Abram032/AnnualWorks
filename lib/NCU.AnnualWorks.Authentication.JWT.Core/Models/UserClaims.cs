using NCU.AnnualWorks.Authentication.JWT.Core.Enums;

namespace NCU.AnnualWorks.Authentication.JWT.Core.Models
{
    public class UserClaims
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string AvatarUrl { get; set; }
        public AccessType AccessType { get; set; }
    }
}
