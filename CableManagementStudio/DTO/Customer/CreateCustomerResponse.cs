namespace CableManagementStudio.DTOs.Customer
{
    public class CreateCustomerResponse
    {
        public string Message { get; set; } = string.Empty;

        public int CustomerId { get; set; }

        public int UserId { get; set; }
    }
}