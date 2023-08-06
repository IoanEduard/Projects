using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DAL.Repositories;
public class BasketRepository : IBasketRespository
{
    private readonly ApplicationDbContext _context;

    public BasketRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> DeleteBasketAsync(Guid basketId)
    {
        var data = await _context.CustomerBasket.FindAsync(basketId);

        _context.CustomerBasket.Remove(data);
        var result = await _context.SaveChangesAsync();

        return result > 0;
    }

    public async Task<CustomerBasket> GetBasketAsync(Guid basketId)
    {
        var basket = await _context.CustomerBasket.FindAsync(basketId);

        if (basket == null) return null;

        var basketItems = await _context.BasketItems.Where(b => b.CustomberBasketId == basketId).ToListAsync();

        if (basketItems == null) return null;

        return new CustomerBasket
        {
            Id = basketId,
            Items = basketItems,
            ClientSecret = basket.ClientSecret,
            PaymentIntentId = basket.PaymentIntentId,
            DeliveryMethodId = basket.DeliveryMethodId
        };
    }

    public async Task<CustomerBasket> SetShippingPrice(CustomerBasket basket)
    {
        var customerBasket = await _context.CustomerBasket.FirstOrDefaultAsync(b => b.Id == basket.Id);
        var deliveryMethod = await _context.DeliveryMethods.FindAsync(basket.DeliveryMethodId);

        if (customerBasket == null) return null;

        var subtotal = basket.Items.Sum(a => a.Price * a.Quantity);
        var total = subtotal + deliveryMethod.Price;

        customerBasket.DeliveryMethodId = deliveryMethod.Id;
        customerBasket.Subtotal = subtotal;
        customerBasket.Total = total;

        _context.Attach(customerBasket);
        _context.Entry(customerBasket).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return customerBasket;
    }

    public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
    {
        var customerBasket = await _context.CustomerBasket.FindAsync(basket.Id);
        var customerBasketToReturn = new CustomerBasket();

        if (customerBasket != null)
        {
            customerBasketToReturn.Id = customerBasket.Id;

            // testing updating in stripe
            customerBasketToReturn.ClientSecret = basket.ClientSecret;
            customerBasketToReturn.PaymentIntentId = basket.PaymentIntentId;

            customerBasket.ClientSecret = basket.ClientSecret;
            customerBasket.PaymentIntentId = basket.PaymentIntentId;

            foreach (var item in basket.Items)
            {
                var basketItem = await _context.BasketItems
                    .FirstOrDefaultAsync(p => p.ProductId == item.ProductId && p.CustomberBasketId == basket.Id);

                if (basketItem == null)
                {
                    item.CustomberBasketId = customerBasket.Id;
                    customerBasketToReturn.Items.Add(item);

                    await _context.BasketItems.AddAsync(item);
                }
                else
                {
                    basketItem.ProductId = item.ProductId;
                    basketItem.ProductName = item.ProductName;
                    basketItem.PictureUrl = item.PictureUrl;
                    basketItem.Price = item.Price;
                    basketItem.Quantity = item.Quantity;


                    _context.Attach(basketItem);
                    _context.Entry(basketItem).State = EntityState.Modified;

                    customerBasketToReturn.Items.Add(basketItem);
                }
            }
        }

        await _context.SaveChangesAsync();

        return customerBasketToReturn;
    }
    public async Task<CustomerBasket> CreateNewEmptyBasket(int productId, int quantity)
    {
        var newBasket = new CustomerBasket();

        await _context.CustomerBasket.AddAsync(newBasket);

        if (await _context.SaveChangesAsync() > 0)
        {
            var item = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);

            var basketItem = new BasketItem()
            {
                PictureUrl = item.PictureUrl,
                Price = item.Price,
                ProductName = item.Name,
                Quantity = quantity,

                ProductId = item.Id,
                CustomberBasketId = newBasket.Id,
            };

            newBasket.DeliveryMethodId = null;
            newBasket.Subtotal = item.Price;
            newBasket.Total = item.Price;

            newBasket.Items.Add(await AddItemInBasket(basketItem, newBasket.Id));
            await _context.SaveChangesAsync();
        }

        return newBasket;
    }

    private async Task<BasketItem> AddItemInBasket(BasketItem item, Guid customerBasketId)
    {
        var newBasketItem = new BasketItem
        {
            CustomberBasketId = customerBasketId,
            ProductId = item.ProductId,
            PictureUrl = item.PictureUrl,
            Price = item.Price,
            ProductName = item.ProductName,
            Quantity = item.Quantity
        };

        await _context.BasketItems.AddAsync(newBasketItem);

        return newBasketItem;
    }

    public async Task<BasketItem> IncrementQuantity(int basketProductId)
    {
        var bItem = await _context.BasketItems.FirstOrDefaultAsync(b => b.ProductId == basketProductId);

        bItem.Quantity += 1;

        _context.Attach(bItem);
        _context.Entry(bItem).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return bItem;
    }

    public async Task<BasketItem> DecrementQuantity(int basketProductId)
    {
        var bItem = await _context.BasketItems.FirstOrDefaultAsync(b => b.ProductId == basketProductId);

        if (bItem.Quantity < 1)
        {
            return null;
        }

        bItem.Quantity -= 1;

        _context.Attach(bItem);
        _context.Entry(bItem).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return bItem;
    }

    public async Task<bool> DeleteBasketItemAsync(int productId)
    {
        var data = await _context.BasketItems.FirstOrDefaultAsync(b => b.ProductId == productId);

        _context.BasketItems.Remove(data);
        var result = await _context.SaveChangesAsync();

        return result > 0;
    }

}
