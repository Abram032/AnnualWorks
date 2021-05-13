using Microsoft.EntityFrameworkCore;
using NCU.AnnualWorks.Core.Models.DbModels.Base;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Repositories
{
    public class Repository<T> : IRepository<T> where T : Entity
    {
        private readonly ApiDbContext _context;
        private readonly DbSet<T> _entities;
        public Repository(ApiDbContext context)
        {
            _context = context;
            _entities = context.Set<T>();
        }

        public IQueryable<T> GetAll() => _entities;

        public Task<T> GetAsync(long id) => _entities.SingleOrDefaultAsync(e => e.Id == id);

        public async Task AddAsync(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException();
            }

            await _entities.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task AddRangeAsync(IEnumerable<T> entities)
        {
            if (entities == null || entities.Any(e => e == null))
            {
                throw new ArgumentNullException();
            }

            await _entities.AddRangeAsync(entities);
            await _context.SaveChangesAsync();
        }

        public Task RemoveAsync(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException();
            }

            _entities.Remove(entity);
            return _context.SaveChangesAsync();
        }

        public Task RemoveRangeAsync(IEnumerable<T> entities)
        {
            if (entities == null || entities.Any(e => e == null))
            {
                throw new ArgumentNullException();
            }

            _entities.RemoveRange(entities);
            return _context.SaveChangesAsync();
        }

        public Task UpdateAsync(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException();
            }

            _entities.Update(entity);
            return _context.SaveChangesAsync();
        }

        public Task UpdateRangeAsync(IEnumerable<T> entities)
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
