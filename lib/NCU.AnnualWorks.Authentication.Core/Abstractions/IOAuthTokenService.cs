namespace NCU.AnnualWorks.Authentication.Core.Abstractions
{
    public interface IOAuthTokenService
    {
        string Get(string key);
        void Remove(string key);
        void SetRequestToken(string key, string value);
        void SetAccessToken(string key, string value);
    }
}
