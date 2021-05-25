using NCU.AnnualWorks.Core.Models.DbModels;
using System;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Repositories
{
    public interface IReviewRepository : IAsyncRepository<Review>
    {
        Task<Review> GetAsync(Guid guid);
    }
}
