namespace NCU.AnnualWorks.Authentication.OAuth.Core.Models
{
    public class OAuthResponse
    {
        public string OAuthToken { get; set; }
        public string OAuthTokenSecret { get; set; }
        public bool OAuthCallbackConfirmed { get; set; }
    }
}