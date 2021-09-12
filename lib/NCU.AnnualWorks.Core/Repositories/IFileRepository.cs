using NCU.AnnualWorks.Core.Models.DbModels;
using System;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Repositories
{
    public interface IFileRepository : IAsyncRepository<File>
    {
        Task<File> GetAsync(Guid id);
        Task<bool> Exists(Guid guid);
        Task Delete(Guid guid);
    }
}
