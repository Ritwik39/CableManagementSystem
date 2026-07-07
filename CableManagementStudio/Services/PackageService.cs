using CableManagementStudio.Models;
using CableManagementStudio.Repositories.Interfaces;
using CableManagementStudio.Services.Interfaces;

namespace CableManagementStudio.Services
{
    public class PackageService : IPackageService
    {
        private readonly IPackageRepository _packageRepository;

        public PackageService(IPackageRepository packageRepository)
        {
            _packageRepository = packageRepository;
        }

        public Task<List<Package>> GetAllAsync()
        {
            return _packageRepository.GetAllAsync();
        }

        public Task<Package?> GetByIdAsync(int id)
        {
            return _packageRepository.GetByIdAsync(id);
        }

        public Task<Package> CreateAsync(Package package)
        {
            return _packageRepository.CreateAsync(package);
        }

        public Task<Package?> UpdateAsync(int id, Package package)
        {
            return _packageRepository.UpdateAsync(id, package);
        }

        public Task<bool> DeleteAsync(int id)
        {
            return _packageRepository.DeleteAsync(id);
        }
    }
}