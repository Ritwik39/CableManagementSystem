using CableManagementStudio.Models;
using CableManagementStudio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using CableManagementStudio.Data;

namespace CableManagementStudio.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByUserNameAsync(string userName)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.UserName == userName);
        }

        public async Task<User> CreateAsync(User user)
        {
            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return user;
        }

    }
}
