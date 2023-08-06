using System;

namespace Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<T> Repository<T>() where T : class;
        IBasketRespository BasketRepository();
        Task<int> Complete();
    }
}
