using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class UserRole : IdentityUserRole<string>
    {
        public int Id { get; set; }
        
        public virtual User User { get; set; }

        public virtual Role Role { get; set; }
        
    }
}