using System;

namespace API.DTO
{
    public class OrderDto
    {
        public Guid BasketId{ get; set; }
        public int DeliveryMethodId { get; set; }
        public AddressDto ShipToAddress { get; set; }
    }
}
