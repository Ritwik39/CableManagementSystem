using CableManagementStudio.DTOs.Customer;
using CableManagementStudio.Models;

namespace CableManagementStudio.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<List<Customer>> GetAllAsync();

        Task<Customer?> GetByIdAsync(int id);

        Task<Customer> CreateAsync(Customer customer);

        Task<Customer?> UpdateAsync(int id, Customer customer);

        Task<bool> DeleteAsync(int id);

        Task<CreateCustomerResponse> RegisterCustomerAsync(CreateCustomerRequest request);

    }
}