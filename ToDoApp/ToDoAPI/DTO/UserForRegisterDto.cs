using System.ComponentModel.DataAnnotations;

namespace ToDoAPI.DTO
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 3, ErrorMessage = "You must specify password between 8 and 3")]
        public string Password { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
