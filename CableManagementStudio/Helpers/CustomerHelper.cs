namespace CableManagementStudio.Helpers
{
    public static class CustomerHelper
    {
        public static string GenerateConnectionNumber()
        {
            return $"CON-{DateTime.Now:yyyyMMddHHmmss}";
        }
    }
}