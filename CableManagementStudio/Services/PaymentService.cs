using CableManagementStudio.Models;
using CableManagementStudio.Repositories;
using CableManagementStudio.Repositories.Interfaces;
using CableManagementStudio.Services.Interfaces;

namespace CableManagementStudio.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly ICustomerRepository _customerRepository;

        public PaymentService(
            IPaymentRepository paymentRepository,
            ICustomerRepository customerRepository)
        {
            _paymentRepository = paymentRepository;
            _customerRepository = customerRepository;
        }

        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            return await _paymentRepository.GetAllAsync();
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _paymentRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Payment>> GetByCustomerIdAsync(int customerId)
        {
            return await _paymentRepository.GetByCustomerIdAsync(customerId);
        }

        public async Task<Payment> CreateAsync(CreatePaymentRequest request)
        {
            var customer = await _customerRepository.GetByIdAsync(request.CustomerId);

            if (customer == null)
                throw new Exception("Customer not found");

            var payment = new Payment
            {
                CustomerId = request.CustomerId,
                Amount = request.Amount,
                PaymentMode = request.PaymentMode,
                Status = "Paid",
                Remarks = request.Remarks,
                PaymentDate = DateTime.Now
            };

            return await _paymentRepository.CreateAsync(payment);
        }
    }
}