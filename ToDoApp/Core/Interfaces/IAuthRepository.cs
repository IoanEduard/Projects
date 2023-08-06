using Core.Entities;

namespace Core.Interfaces.Repository
{
    public interface IAuthRepository
    {
        Task<User> Register(User user, string password);
        Task<User> Login(string username, string password);
        Task<bool> UserExists(string username);
        Task<User> FindUser(string userId);
        Task<IReadOnlyList<User>> SearchUserByName(string searchText);
    }
}