using CableManagementStudio.Models;

namespace CableManagementStudio.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByUserNameAsync(string userName);

        Task<User> CreateAsync(User user);
    }
}
