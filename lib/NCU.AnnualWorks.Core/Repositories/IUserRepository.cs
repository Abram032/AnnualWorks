using NCU.AnnualWorks.Core.Models.DbModels;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Repositories
{
    public interface IUserRepository : IAsyncRepository<User>
    {
        Task<User> GetAsync(string usosId);
    }
}
