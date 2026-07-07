using CableManagementStudio.Models;

namespace CableManagementStudio.Repositories.Interfaces
{
    public interface IPackageRepository
    {
        Task<List<Package>> GetAllAsync();

        Task<Package?> GetByIdAsync(int id);

        Task<Package> CreateAsync(Package package);

        Task<Package?> UpdateAsync(int id, Package package);

        Task<bool> DeleteAsync(int id);
    }
}