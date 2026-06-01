using CableManagementStudio.Models;
using CableManagementStudio.Repositories;
using CableManagementStudio.Repositories.Interfaces;
using CableManagementStudio.Services.Interfaces;

namespace CableManagementStudio.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerService(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public Task<List<Customer>> GetAllAsync()
        {
            return _customerRepository.GetAllAsync();
        }

        public Task<Customer?> GetByIdAsync(int id)
        {
            return _customerRepository.GetByIdAsync(id);
        }

        public Task<Customer> CreateAsync(Customer customer)
        {
            return _customerRepository.CreateAsync(customer);
        }

        public Task<Customer?> UpdateAsync(int id, Customer customer)
        {
            return _customerRepository.UpdateAsync(id, customer);
        }

        public Task<bool> DeleteAsync(int id)
        {
            return _customerRepository.DeleteAsync(id);
        }
    }
}