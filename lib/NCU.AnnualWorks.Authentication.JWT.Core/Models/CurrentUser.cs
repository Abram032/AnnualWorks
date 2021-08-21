namespace NCU.AnnualWorks.Authentication.JWT.Core.Models
{
    public struct CurrentUser
    {
        public long Id { get; set; }
        public bool IsParticipant { get; set; }
        public bool IsLecturer { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsCustom { get; set; }
        public bool IsEmployee { get; set; }

        public string Token { get; set; }
        public string TokenSecret { get; set; }
    }
}
