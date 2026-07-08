using AutoMapper;
using CableManagementStudio.DTOs.Customer;
using CableManagementStudio.Models;
using CableManagementStudio.Repositories;
using CableManagementStudio.Repositories.Interfaces;
using CableManagementStudio.Services.Interfaces;
using System;


namespace CableManagementStudio.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<CustomerService> _logger;
        private readonly IMapper _mapper;
        public CustomerService(
     ICustomerRepository customerRepository,
     IUserRepository userRepository,
     ILogger <CustomerService> logger,
     IMapper mapper)
        {
            _customerRepository = customerRepository;
            _userRepository = userRepository;
            _logger = logger;
            _mapper = mapper;
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
            _logger.LogInformation(
                "Starting customer registration for username: {UserName}",
                request.UserName);

            // Check existing username
            var existingUser = await _userRepository.GetByUserNameAsync(request.UserName);

            if (existingUser != null)
            {
                _logger.LogWarning(
                    "Registration failed. Username already exists: {UserName}",
                    request.UserName);

                throw new Exception("Username already exists.");
            }

            // Create User
            var user = _mapper.Map<User>(request);

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            user.Role = "Customer";
            user.IsActive = true;

            await _userRepository.AddUserAsync(user);

            // Create Customer
            var customer = _mapper.Map<Customer>(request);

            customer.UserId = user.UserId;
            customer.IsActive = true;

            await _customerRepository.CreateAsync(customer);

            _logger.LogInformation(
                "Customer created successfully. CustomerId: {CustomerId}, UserId: {UserId}",
                customer.CustomerId,
                user.UserId);

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