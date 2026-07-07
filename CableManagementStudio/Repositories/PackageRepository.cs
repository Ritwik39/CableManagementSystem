using CableManagementStudio.Data;
using CableManagementStudio.Models;
using CableManagementStudio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CableManagementStudio.Repositories
{
    public class PackageRepository : IPackageRepository
    {
        private readonly ApplicationDbContext _context;

        public PackageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Package>> GetAllAsync()
        {
            return await _context.Packages.ToListAsync();
        }

        public async Task<Package?> GetByIdAsync(int id)
        {
            return await _context.Packages.FindAsync(id);
        }

        public async Task<Package> CreateAsync(Package package)
        {
            _context.Packages.Add(package);

            await _context.SaveChangesAsync();

            return package;
        }

        public async Task<Package?> UpdateAsync(int id, Package package)
        {
            var existingPackage = await _context.Packages.FindAsync(id);

            if (existingPackage == null)
                return null;

            existingPackage.PackageName = package.PackageName;
            existingPackage.Price = package.Price;
            existingPackage.SpeedMbps = package.SpeedMbps;

            await _context.SaveChangesAsync();

            return existingPackage;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var package = await _context.Packages.FindAsync(id);

            if (package == null)
                return false;

            _context.Packages.Remove(package);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}