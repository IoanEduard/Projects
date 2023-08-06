using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class CustomerBasketDto
    {
        [Required]
        public Guid Id { get; set; }
        public List<BasketItemDto> Items { get; set; }
        public int? DeliveryMethodId { get; set; }
        public decimal ShippingPrice { get; set; }
        public decimal Total { get; set; }
        public decimal Subtotal { get; set; }
        public string ClientSecret { get; set; }
        public string PaymentIntentId { get; set; }
    }
}