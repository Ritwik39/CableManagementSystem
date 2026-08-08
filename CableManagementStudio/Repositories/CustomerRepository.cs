using CableManagementStudio.Data;
using CableManagementStudio.DTOs.Customer;
using CableManagementStudio.Models;
using CableManagementStudio.Repositories.Interfaces;
using CableManagementStudio.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CableManagementStudio.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ApplicationDbContext _context;

        public CustomerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Customer>> GetAllAsync()
        {
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer?> GetByIdAsync(int id)
        {
            return await _context.Customers.FindAsync(id);
        }

        public async Task<Customer> CreateAsync(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<Customer?> UpdateAsync(int id, Customer customer)
        {
            var existingCustomer = await _context.Customers.FindAsync(id);

            if (existingCustomer == null)
                return null;

            existingCustomer.Name = customer.Name;
            existingCustomer.Mobile = customer.Mobile;
            existingCustomer.Address = customer.Address;
            existingCustomer.ConnectionNumber = customer.ConnectionNumber;
            existingCustomer.PackageId = customer.PackageId;
            existingCustomer.IsActive = customer.IsActive;


            await _context.SaveChangesAsync();
            return existingCustomer;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
                return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<CustomerProfileResponse?> GetProfileAsync(int userId)
        {
            return await _context.Customers
                .Include(c => c.Package)
                .Where(c => c.UserId == userId)
                .Select(c => new CustomerProfileResponse
                {
                    CustomerId = c.CustomerId,
                    Name = c.Name,
                    Mobile = c.Mobile,
                    Address = c.Address,
                    ConnectionNumber = c.ConnectionNumber,
                    IsActive = c.IsActive,

                    PackageName = c.Package != null ? c.Package.PackageName : null,
                    Price = c.Package != null ? c.Package.Price : null,
                    SpeedMbps = c.Package != null ? c.Package.SpeedMbps : null
                })
                .FirstOrDefaultAsync();
        }
    }
}