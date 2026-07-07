using System.ComponentModel.DataAnnotations;

namespace CableManagementStudio.Models
{
    public class User
    {
        public int UserId { get; set; }

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public string? ResetToken { get; set; }

        public DateTime? ResetTokenExpiry { get; set; }
        public object Name { get; internal set; }
    }
}