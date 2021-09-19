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

        private IQueryable<File> GetIncludes(DbSet<File> files)
            => files.Include(f => f.Thesis)
            .ThenInclude(f => f.ThesisAuthors)
            .Include(f => f.CreatedBy)
            .Include(f => f.ModifiedBy)
            .Include(f => f.ThesisAdditionalFiles)
            .ThenInclude(f => f.Thesis)
            .Include(f => f.Thesis);

        public async Task<File> GetAsync(Guid guid) =>
            await GetIncludes(_entities).FirstOrDefaultAsync(f => f.Guid == guid);

        public async Task<bool> Exists(Guid guid) => await _entities.AnyAsync(f => f.Guid == guid);

        public async Task Delete(Guid guid)
        {
            var file = await _entities.SingleAsync(f => f.Guid == guid);
            _entities.Remove(file);
            await _context.SaveChangesAsync();
        }
    }
}
