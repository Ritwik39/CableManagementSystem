using CableManagementStudio.Data;
using CableManagementStudio.Models;
using CableManagementStudio.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CableManagementStudio.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            return await _context.Payments
                .Include(p => p.Customer)
                .ToListAsync();
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _context.Payments
                .Include(p => p.Customer)
                .FirstOrDefaultAsync(p => p.PaymentId == id);
        }

        public async Task<IEnumerable<Payment>> GetByCustomerIdAsync(
            int customerId)
        {
            return await _context.Payments
                .Where(p => p.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<Payment> CreateAsync(Payment payment)
        {
            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();

            return payment;
        }
    }
}