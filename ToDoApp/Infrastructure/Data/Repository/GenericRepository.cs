using System.Linq.Expressions;
using AutoMapper;
using Core.Entities;
using Core.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        public GenericRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void AddAsync(T entity)
        {
            _context.Set<T>().Add(entity);
        }

        public void DeleteAsync(T entity)
        {
            _context.Set<T>().Remove(entity);
        }

        public void DeleteRange(IEnumerable<T> entities)
        {
            _context.Set<T>().RemoveRange(entities);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsyncByPredicate(Expression<Func<T, bool>> predicate)
        {
            var query = _context.Set<T>().AsQueryable();

            return await query.Where(predicate).ToListAsync();
        }
    }
}