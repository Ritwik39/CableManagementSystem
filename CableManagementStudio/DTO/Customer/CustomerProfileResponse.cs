namespace CableManagementStudio.DTOs.Customer
{
    public class CustomerProfileResponse
    {
        public int CustomerId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Mobile { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string ConnectionNumber { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        public string? PackageName { get; set; }

        public decimal? Price { get; set; }

        public int? SpeedMbps { get; set; }
    }
}