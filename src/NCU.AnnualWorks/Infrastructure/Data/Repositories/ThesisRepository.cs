using Microsoft.EntityFrameworkCore;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Infrastructure.Data.Repositories
{
    public class ThesisRepository : AsyncRepository<Thesis>, IThesisRepository
    {
        public ThesisRepository(ApiDbContext context) : base(context)
        {
        }

        private IQueryable<Thesis> GetIncludes(DbSet<Thesis> theses)
            => theses
                .Include(p => p.Promoter)
                .Include(p => p.Reviewer)
                .Include(p => p.ThesisAuthors)
                .ThenInclude(p => p.Author)
                .Include(p => p.ThesisKeywords)
                .ThenInclude(p => p.Keyword)
                .Include(p => p.File)
                .Include(p => p.ThesisAdditionalFiles)
                .ThenInclude(p => p.File)
                .Include(p => p.ThesisLogs)
                .ThenInclude(p => p.User)
                .Include(p => p.Reviews)
                .AsQueryable();

        public Task<Thesis> GetAsync(Guid guid) =>
            GetIncludes(_entities)
            .SingleOrDefaultAsync(p => p.Guid == guid);
    }
}
