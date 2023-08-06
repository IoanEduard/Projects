using System.Security.Claims;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class UserManagerExtentions
    {
        public static async Task<AppUser> FindByClaimsPrincipalWithAddressAsync(this UserManager<AppUser> userManager, ClaimsPrincipal userClaims)
        {
            var email = userClaims?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            return await userManager.Users.Include(a => a.Address).SingleOrDefaultAsync(e => e.Email == email);
        }

        public static async Task<AppUser> FindByEmailWithFromClaimsPrincipalAsync(this UserManager<AppUser> userManager, ClaimsPrincipal userClaims)
        {
            var email = userClaims?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            return await userManager.Users.SingleOrDefaultAsync(e => e.Email == email);
        }
    }
}
