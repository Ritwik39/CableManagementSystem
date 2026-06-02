namespace CableManagementStudio.DTOs.Customer
{
    public class CreateCustomerRequest
    {
        public string FullName { get; set; } = string.Empty;

        public string UserName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string Mobile { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string ConnectionNumber { get; set; } = string.Empty;

        public int PackageId { get; set; }
    }
}