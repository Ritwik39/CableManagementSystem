namespace CableManagementStudio.Models
{
    public class Package
    {
        public int PackageId { get; set; }

        public string PackageName { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public int SpeedMbps { get; set; }
    }
}