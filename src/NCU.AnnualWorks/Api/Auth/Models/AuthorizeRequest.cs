namespace NCU.AnnualWorks.Api.Auth.Models
{
    public class AuthorizeRequest
    {
        public string OAuthToken { get; set; }
        public string OAuthVerifier { get; set; }
    }
}
