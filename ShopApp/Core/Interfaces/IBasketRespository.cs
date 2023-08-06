using Core.Entities;

namespace Core.Interfaces
{
    public interface IBasketRespository
    {
        Task<CustomerBasket> GetBasketAsync(Guid basketId);
        Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket);
        Task<CustomerBasket> SetShippingPrice(CustomerBasket basket);
        Task<CustomerBasket> CreateNewEmptyBasket(int productId, int quantity);
        Task<BasketItem> IncrementQuantity(int basketProductId);
        Task<BasketItem> DecrementQuantity(int basketProductId);
        Task<bool> DeleteBasketAsync(Guid basketId);
        Task<bool> DeleteBasketItemAsync(int productId);
    }
}