namespace NCU.AnnualWorks.Integrations.Usos.Core.Options
{
    public class UsosClientOptions
    {
        //OAuth 1.0a properties
        public string ConsumerKey { get; set; }
        public string ConsumerSecret { get; set; }

        //USOS API properties
        public string BaseApiAddress { get; set; }
        public string RequestTokenEndpoint { get; set; }
        public string AuthorizeEndpoint { get; set; }
        public string AccessTokenEndpoint { get; set; }

        //Application properties
        public string CallbackEndpoint { get; set; }
        public string CourseKey { get; set; }
        public string DefaultAdministratorEmail { get; set; }
    }
}
