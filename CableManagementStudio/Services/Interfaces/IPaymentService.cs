using CableManagementStudio.Models;

namespace CableManagementStudio.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<IEnumerable<Payment>> GetAllAsync();
        Task<Payment?> GetByIdAsync(int id);
        Task<IEnumerable<Payment>> GetByCustomerIdAsync(int customerId);
        Task<Payment> CreateAsync(CreatePaymentRequest request);
    }
}