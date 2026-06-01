using System.ComponentModel.DataAnnotations;

namespace CableManagementStudio.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Mobile { get; set; }

        public string Address { get; set; }

        public string ConnectionNumber { get; set; }

        public bool IsActive { get; set; }
    }
}
