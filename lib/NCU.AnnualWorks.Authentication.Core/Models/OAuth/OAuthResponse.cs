namespace NCU.AnnualWorks.Authentication.Core.Models.OAuth
{
    public class OAuthResponse
    {
        public string OAuthToken { get; set; }
        public string OAuthTokenSecret { get; set; }
        public bool OAuthCallbackConfirmed { get; set; }
    }
}
