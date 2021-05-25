using NCU.AnnualWorks.Core.Models.DbModels;
using System;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Repositories
{
    public interface IFileRepository
    {
        Task<File> GetAsync(Guid id);
    }
}
