using System;
using System.Collections;
using Core.Interfaces;

namespace Infrastructure.DAL.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private Hashtable _repositories;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IGenericRepository<T> Repository<T>() where T : class
        {
            if (_repositories == null) _repositories = new Hashtable();

            var type = typeof(T).Name;

            if (!_repositories.ContainsKey(type))
            {
                var repositoryType = typeof(GenericRepository<>);
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(T)), _context);

                _repositories.Add(type, repositoryInstance);
            }

            return (IGenericRepository<T>)_repositories[type];
        }

        public IBasketRespository BasketRepository()
        {
            if (_repositories == null) _repositories = new Hashtable();

            var type = typeof(BasketRepository).Name;

            if (!_repositories.ContainsKey(type))
            {
                var repositoryType = typeof(BasketRepository);
                var repositoryInstance = Activator.CreateInstance(repositoryType, _context);

                _repositories.Add(type, repositoryInstance);
            }

            return (IBasketRespository)_repositories[type];
        }
    }
}
