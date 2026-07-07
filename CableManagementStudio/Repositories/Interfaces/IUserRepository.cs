using CableManagementStudio.Models;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUserNameAsync(string userName);
    Task<User?> GetByIdAsync(int id);
    Task AddUserAsync(User user);
    Task UpdateUserAsync(User user);
}