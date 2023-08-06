using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities
{
    public class User : IdentityUser
    {
        public virtual ICollection<Core.Entities.Task> Tasks { get; set; }
        //public virtual UserInformation UserInformation { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
        
    }
}