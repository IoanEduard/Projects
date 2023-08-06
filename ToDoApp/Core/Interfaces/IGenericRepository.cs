using System.Linq.Expressions;
using Core.Entities;

namespace Core.Interfaces.Repository
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetAllAsyncByPredicate(Expression<Func<T, bool>> predicate);
        void AddAsync(T entity);
        void Update(T entity);
        void DeleteAsync(T entity);
        void DeleteRange(IEnumerable<T> entities);
    }
}