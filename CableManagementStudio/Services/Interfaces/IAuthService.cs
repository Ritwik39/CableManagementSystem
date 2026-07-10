using CableManagementStudio.Common;
using CableManagementStudio.DTOs.Auth;
using CableManagementStudio.Models;

namespace CableManagementStudio.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<object>> RegisterAsync(RegisterRequest request);

        Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request);

        Task<ApiResponse<object>> ForgotPasswordAsync(ForgotPasswordRequest request);

        Task<ApiResponse<object>> ResetPasswordAsync(ResetPasswordRequest request);

        Task<ApiResponse<object>> ChangePasswordAsync(
            string userName,
            ChangePasswordRequest request);
    }
}