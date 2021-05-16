namespace NCU.AnnualWorks.Constants
{
    //TODO: Move to Core
    public static class AntiforgeryConsts
    {
        public const string FormFieldName = "__RequestAntiforgeryToken";
        public const string HeaderName = "X-CSRF-TOKEN";
        public const string CookieName = "CSRF-TOKEN";
        public const string FormCookieName = "CSRF-REQUEST-TOKEN";
    }
}
