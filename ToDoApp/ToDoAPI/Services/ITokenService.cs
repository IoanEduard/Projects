using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace ToDoAPI.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}