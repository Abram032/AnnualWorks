namespace NCU.AnnualWorks.Integrations.Usos.Core.Options
{
    public class UsosServiceOptions
    {
        //OAuth 1.0a properties
        public string ConsumerKey { get; set; }
        public string ConsumerSecret { get; set; }

        //USOS API properties
        public string BaseApiAddress { get; set; }
        public string LogoutAddress { get; set; }
        public string[] DefaultScopes { get; set; }
        public UsosFields UsosFields { get; set; }
        public UsosEndpoints UsosEndpoints { get; set; }

        //Application properties
        public string CallbackEndpoint { get; set; }
        public string CourseCode { get; set; }
        public string DefaultAdministratorUsosId { get; set; }

        //Technical
        public string DateFormatPattern { get; set; }
    }

    public class UsosFields
    {
        public string[] Users { get; set; }
    }

    public class UsosEndpoints
    {
        public string RequestToken { get; set; }
        public string Authorize { get; set; }
        public string AccessToken { get; set; }
        public string RevokeToken { get; set; }
        public string TermsTerm { get; set; }
        public string TermsSearch { get; set; }
        public string UsersUser { get; set; }
        public string UsersUsers { get; set; }
        public string CoursesCourseEdition { get; set; }
        public string CoursesIsCoordinator { get; set; }
        public string CoursesIsLecturer { get; set; }
        public string CoursesIsParticipant { get; set; }
    }
}
