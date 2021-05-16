using NCU.AnnualWorks.Core.Models.DbModels;
using System;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Repositories
{
    public interface IThesisRepository : IAsyncRepository<Thesis>
    {
        Task<Thesis> GetAsync(Guid guid);
    }
}
