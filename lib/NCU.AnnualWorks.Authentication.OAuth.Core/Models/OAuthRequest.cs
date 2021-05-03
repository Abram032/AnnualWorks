namespace NCU.AnnualWorks.Authentication.OAuth.Core.Models
{
    public class OAuthRequest
    {
        public string OAuthConsumerKey { get; set; }
        public string OAuthConsumerSecret { get; set; }
        public string OAuthSignatureMethod { get; set; }
        public string OAuthCallback { get; set; }
        public string OAuthToken { get; set; }
        public string OAuthTokenSecret { get; set; }
        public string OAuthVerifier { get; set; }
    }
}
