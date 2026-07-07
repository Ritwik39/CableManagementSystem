using CableManagementStudio.Models;

public interface IUserService
{
    Task<string> RegisterAsync(RegisterRequest request);
    Task<string> LoginAsync(LoginRequest request);
    Task<string> ForgotPasswordAsync(string email);
    Task<string> ChangePasswordAsync(ChangePasswordRequest request);
    Task<string> ResetPasswordAsync(ResetPasswordRequest request);
}