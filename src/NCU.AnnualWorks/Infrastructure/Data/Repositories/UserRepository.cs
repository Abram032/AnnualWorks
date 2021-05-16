using Microsoft.EntityFrameworkCore;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Repositories;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Infrastructure.Data.Repositories
{
    public class UserRepository : AsyncRepository<User>, IUserRepository
    {
        public UserRepository(ApiDbContext context) : base(context)
        {
        }

        public Task<User> GetAsync(string usosId) =>
            _entities.SingleOrDefaultAsync(p => p.UsosId == usosId);
    }
}
