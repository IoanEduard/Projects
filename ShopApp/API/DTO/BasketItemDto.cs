using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class BasketItemDto
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public string ProductName { get; set; }
        [Required]
        [Range(0.1, double.MaxValue, ErrorMessage = "Must be above 0")]
        public decimal Price { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Must be above 0")]
        public int Quantity { get; set; }
        [Required]
        public string PictureUrl { get; set; }
    }
}