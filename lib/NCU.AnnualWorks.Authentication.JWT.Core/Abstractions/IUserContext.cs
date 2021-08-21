using Microsoft.AspNetCore.Http;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Authentication.OAuth.Core.Models;

namespace NCU.AnnualWorks.Authentication.JWT.Core.Abstractions
{
    public interface IUserContext
    {
        CurrentUser CurrentUser { get; }
        void SetCurrentUser(HttpContext context);
        OAuthRequest GetCredentials();
    }
}
