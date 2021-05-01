namespace NCU.AnnualWorks.Authentication.JWT.Core.Enums
{
    public enum AccessType
    {
        Unknown, //Unknown - used during login process or for non-registered users
        Default, //Read-only access - Students and past users of the system (including employees)
        Employee, //Read-Write access - Promoters and reviewers, lecuterers and coordinators of the course
        Admin //Full access - Users specified in database as administrators
    }
}
