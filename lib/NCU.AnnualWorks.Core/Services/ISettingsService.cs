using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using System;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Services
{
    public interface ISettingsService
    {
        Task<DateTime?> GetDeadline();
        Task<DateTime> GetDeadline(OAuthRequest oauthRequest);
        Task<bool> SetDeadline(OAuthRequest oauthRequest, DateTime deadline);
    }
}
