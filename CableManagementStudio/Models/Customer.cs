using System.ComponentModel.DataAnnotations;

namespace CableManagementStudio.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }

        public int UserId { get; set; }

        public User? User { get; set; }

        public int PackageId { get; set; }

        public Package? Package { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Mobile { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string ConnectionNumber { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }
}