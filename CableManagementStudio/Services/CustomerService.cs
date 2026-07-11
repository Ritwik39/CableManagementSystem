using CableManagementStudio.Models;
using CableManagementStudio.Repositories;
using CableManagementStudio.Repositories.Interfaces;
using CableManagementStudio.Services.Interfaces;
using CableManagementStudio.DTOs.Customer;
using System;


namespace CableManagementStudio.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IUserRepository _userRepository;

        public CustomerService(
     ICustomerRepository customerRepository,
     IUserRepository userRepository)
        {
            _customerRepository = customerRepository;
            _userRepository = userRepository;
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

        public Task<CustomerProfileResponse?> GetProfileAsync(int userId)
        {
            return _customerRepository.GetProfileAsync(userId);
        }

        public async Task<CreateCustomerResponse> RegisterCustomerAsync(CreateCustomerRequest request)
        {
            // Check existing username
            var existingUser = await _userRepository.GetByUserNameAsync(request.UserName);

            if (existingUser != null)
            {
                throw new Exception("Username already exists.");
            }

            // Create User
            var user = new User
            {
                FullName = request.FullName,
                UserName = request.UserName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Customer",
                IsActive = true
            };

            await _userRepository.AddUserAsync(user);

            // Create Customer
            var customer = new Customer
            {
                UserId = user.UserId,
                Name = request.FullName,
                Mobile = request.Mobile,
                Address = request.Address,
                ConnectionNumber = request.ConnectionNumber,
                PackageId = request.PackageId,
                IsActive = true
            };

            await _customerRepository.CreateAsync(customer);

            // Response
            return new CreateCustomerResponse
            {
                Message = "Customer created successfully.",
                CustomerId = customer.CustomerId,
                UserId = user.UserId
            };
        }
    }
}