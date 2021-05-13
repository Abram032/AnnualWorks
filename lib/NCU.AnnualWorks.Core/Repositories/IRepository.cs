using NCU.AnnualWorks.Core.Models.DbModels.Base;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Repositories
{
    public interface IRepository<T> where T : Entity
    {
        IQueryable<T> GetAll();
        Task<T> GetAsync(long id);
        Task AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        Task RemoveAsync(T entity);
        Task RemoveRangeAsync(IEnumerable<T> entities);
        Task UpdateAsync(T entity);
        Task UpdateRangeAsync(IEnumerable<T> entities);
    }
}
