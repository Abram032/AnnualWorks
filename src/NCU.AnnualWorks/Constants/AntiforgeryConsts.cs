namespace NCU.AnnualWorks.Constants
{
    public static class AntiforgeryConsts
    {
        public const string FormFieldName = "__RequestAntiforgeryToken";
        public const string HeaderName = "X-CSRF-TOKEN";
        public const string CookieName = "X-CSRF-TOKEN";
        public const string FormCookieName = "X-CSRF-REQUEST-TOKEN";
    }
}
