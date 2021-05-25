namespace NCU.AnnualWorks.Authentication.JWT.Core.Models
{
    public class UserClaims
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string AvatarUrl { get; set; }
        public bool IsParticipant { get; set; }
        public bool IsLecturer { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsCustom { get; set; }
    }
}
