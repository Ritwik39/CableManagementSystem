using CableManagementStudio.Models;

namespace CableManagementStudio.Repositories.Interfaces
{
    public interface IPaymentRepository
    {
        Task<IEnumerable<Payment>> GetAllAsync();

        Task<Payment?> GetByIdAsync(int id);

        Task<IEnumerable<Payment>> GetByCustomerIdAsync(int customerId);

        Task<Payment> CreateAsync(Payment payment);
    }
}