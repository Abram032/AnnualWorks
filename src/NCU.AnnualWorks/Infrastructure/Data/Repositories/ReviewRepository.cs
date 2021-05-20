using Microsoft.EntityFrameworkCore;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Infrastructure.Data.Repositories
{
    public class ReviewRepository : AsyncRepository<Review>, IReviewRepository
    {
        public ReviewRepository(ApiDbContext context) : base(context)
        {

        }

        private IQueryable<Review> GetIncludes(DbSet<Review> reviews)
            => reviews.Include(r => r.Thesis)
            .Include(r => r.CreatedBy)
            .Include(r => r.ModifiedBy)
            .Include(r => r.File)
            .Include(r => r.ReviewQnAs)
            .ThenInclude(r => r.Question)
            .Include(r => r.ReviewQnAs)
            .ThenInclude(r => r.Answer);

        public Task<Review> GetAsync(Guid guid) =>
            GetIncludes(_entities).FirstOrDefaultAsync(r => r.Guid == guid);
    }
}
