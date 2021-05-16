using Microsoft.EntityFrameworkCore;
using NCU.AnnualWorks.Core.Models.DbModels.Base;
using NCU.AnnualWorks.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Infrastructure.Data.Repositories
{
    public class AsyncRepository<T> : IAsyncRepository<T> where T : Entity
    {
        protected readonly ApiDbContext _context;
        protected readonly DbSet<T> _entities;
        public AsyncRepository(ApiDbContext context)
        {
            _context = context;
            _entities = context.Set<T>();
        }

        public virtual IQueryable<T> GetAll() => _entities;

        public virtual Task<T> GetAsync(long id) => _entities.SingleOrDefaultAsync(e => e.Id == id);

        public virtual async Task AddAsync(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException();
            }

            await _entities.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task AddRangeAsync(IEnumerable<T> entities)
        {
            if (entities == null || entities.Any(e => e == null))
            {
                throw new ArgumentNullException();
            }

            await _entities.AddRangeAsync(entities);
            await _context.SaveChangesAsync();
        }

        public virtual Task RemoveAsync(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException();
            }

            _entities.Remove(entity);
            return _context.SaveChangesAsync();
        }

        public virtual Task RemoveRangeAsync(IEnumerable<T> entities)
        {
            if (entities == null || entities.Any(e => e == null))
            {
                throw new ArgumentNullException();
            }

            _entities.RemoveRange(entities);
            return _context.SaveChangesAsync();
        }

        public virtual Task UpdateAsync(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException();
            }

            _entities.Update(entity);
            return _context.SaveChangesAsync();
        }

        public virtual Task UpdateRangeAsync(IEnumerable<T> entities)
        {
            if (entities == null || entities.Any(e => e == null))
            {
                throw new ArgumentNullException();
            }
            _entities.UpdateRange(entities);
            return _context.SaveChangesAsync();
        }
    }
}
