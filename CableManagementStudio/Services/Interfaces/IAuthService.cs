using CableManagementStudio.Models;
using CableManagementStudio.DTOs.Auth;

namespace CableManagementStudio.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequest request);

        Task<LoginResponse?> LoginAsync(LoginRequest request);

        Task<string> ForgotPasswordAsync(ForgotPasswordRequest request);

        Task<string> ResetPasswordAsync(ResetPasswordRequest request);

        Task<string> ChangePasswordAsync(
            string userName,
            ChangePasswordRequest request);
    }
}