using Core.Entities.OrderAggregate;

namespace Core.Entities
{
    public class CustomerBasket
    {
        public CustomerBasket()
        {
            Id = Guid.NewGuid();
            Items = new List<BasketItem>();
        }

        public Guid Id { get; set; }
        public ICollection<BasketItem> Items { get; set; }
        public int? DeliveryMethodId { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public decimal Total { get; set; }
        public decimal Subtotal { get; set; }
        public string ClientSecret { get; set; }
        public string PaymentIntentId { get; set; }
    }
}