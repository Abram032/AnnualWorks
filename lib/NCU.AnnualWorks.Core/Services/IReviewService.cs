using NCU.AnnualWorks.Core.Models.DbModels;
using System;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Services
{
    public interface IReviewService
    {
        Task<Review> GetAsync(Guid reviewGuid);
        bool ReviewExists(Guid reviewGuid);
        Task<bool> IsReviewConfirmed(Guid reviewGuid);
        Task CancelReviewConfirmation(Guid reviewGuid);
        Task SendEmailCancelReview(Guid reviewGuid);
    }
}
