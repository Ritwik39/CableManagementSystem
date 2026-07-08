namespace CableManagementStudio.Services.Interfaces
{
    public interface IApplicationInfoService
    {
        DateTime StartedAt { get; }

        string GetVersion();

        string GetEnvironment();
    }
}