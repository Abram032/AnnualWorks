namespace NCU.AnnualWorks.Integrations.Usos.Core.Scopes
{
    public static class UserScopes
    {
        public const string Id = "id";
        public const string FirstName = "first_name";
        public const string LastName = "last_name";
        public const string PhotoUrls = "photo_urls[200x200]"; //Default photo is 50x50, we take only one but bigger
    }
}
