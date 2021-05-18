namespace NCU.AnnualWorks.Authentication.JWT.Core.Constants
{
    //Directly references to AccessType enum
    public static class AuthorizationPolicies
    {
        public const string AuthenticatedOnly = "AuthenticatedOnly";
        public const string AtLeastStudent = "AtLeastStudent";
        public const string AtLeastEmployee = "AtLeastEmployee";
        public const string LecturersOnly = "LecturersOnly";
        public const string AdminOnly = "AdminOnly";
    }
}
