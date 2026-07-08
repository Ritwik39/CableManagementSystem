using CableManagementStudio.Services.Interfaces;

namespace CableManagementStudio.Services
{
    public class ApplicationInfoService : IApplicationInfoService
    {
        public DateTime StartedAt { get; } = DateTime.Now;

        public string GetVersion()
        {
            return "1.0.0";
        }

        public string GetEnvironment()
        {
            return Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
        }
    }
}