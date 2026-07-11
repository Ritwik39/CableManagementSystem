using System.ComponentModel.DataAnnotations;

namespace CableManagementStudio.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }

        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public decimal Amount { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        public string PaymentMode { get; set; } = string.Empty;
        // Cash / UPI / Card / NetBanking

        public string Status { get; set; } = "Paid";
        // Paid / Pending / Failed

        public string Remarks { get; set; } = string.Empty;
    }
}