using System;
using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtentions
    {
        public static string RetrieveEmailFromPrinciapl(this ClaimsPrincipal user)
        {
            return user?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        }
    }
}
