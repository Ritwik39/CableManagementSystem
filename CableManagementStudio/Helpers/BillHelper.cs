namespace CableManagementStudio.Helpers
{
    public static class BillHelper
    {
        public static string GenerateBillNumber()
        {
            return $"BILL-{Guid.NewGuid().ToString()[..8]}";
        }
    }
}