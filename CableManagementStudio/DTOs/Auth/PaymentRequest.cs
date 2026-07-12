namespace CableManagementStudio.Models
{
    public class CreatePaymentRequest
    {
        public int CustomerId { get; set; }

        public decimal Amount { get; set; }

        public string PaymentMode { get; set; } = string.Empty;

        public string? Remarks { get; set; }
    }
}