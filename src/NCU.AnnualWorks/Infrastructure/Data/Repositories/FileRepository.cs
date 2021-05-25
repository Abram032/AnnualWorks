using Microsoft.EntityFrameworkCore;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Infrastructure.Data.Repositories
{
    public class FileRepository : AsyncRepository<File>, IFileRepository
    {
        public FileRepository(ApiDbContext context) : base(context)
        {

        }

        private IQueryable<File> GetIncludes(DbSet<File> reviews)
            => reviews.Include(f => f.Thesis)
            .ThenInclude(f => f.ThesisAuthors)
            .Include(f => f.CreatedBy)
            .Include(f => f.ModifiedBy);

        public Task<File> GetAsync(Guid guid) =>
            GetIncludes(_entities).FirstOrDefaultAsync(f => f.Guid == guid);
    }
}
