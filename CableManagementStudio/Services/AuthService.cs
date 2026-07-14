using AutoMapper;
using CableManagementStudio.Common;
using CableManagementStudio.DTOs.Auth;
using CableManagementStudio.Models;
using CableManagementStudio.Repositories.Interfaces;
using CableManagementStudio.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CableManagementStudio.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;
        private readonly IMapper _mapper;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        public AuthService(
            IUserRepository userRepository,
            IRefreshTokenRepository refreshTokenRepository,
            IConfiguration configuration,
            ILogger<AuthService> logger,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _configuration = configuration;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<ApiResponse<object>> RegisterAsync(RegisterRequest request)
        {
            _logger.LogInformation(
                "Registration started for username: {UserName}",
                request.UserName);

            var existingEmail = await _userRepository.GetByEmailAsync(request.Email);

            if (existingEmail != null)
            {
                _logger.LogWarning(
                    "Registration failed. Email already exists: {Email}",
                    request.Email);

                return ApiResponse<object>.FailureResponse(
     "Email already exists");
            }

            var existingUserName = await _userRepository.GetByUserNameAsync(request.UserName);

            if (existingUserName != null)
            {
                _logger.LogWarning(
                    "Registration failed. Username already exists: {UserName}",
                    request.UserName);

                return ApiResponse<object>.FailureResponse(
    "Username already exists");
            }

            var user = _mapper.Map<User>(request);

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            user.Role = "Customer";
            user.IsActive = true;

            await _userRepository.AddUserAsync(user);

            _logger.LogInformation(
                "User registered successfully. UserId: {UserId}",
                user.UserId);

            return ApiResponse<object>.SuccessResponse(
    null,
    "User registered successfully");
        }

        public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request)
        {
            _logger.LogInformation(
                "Login attempt for username: {UserName}",
                request.UserName);

            var user = await _userRepository.GetByUserNameAsync(request.UserName);

            if (user == null)
            {
                _logger.LogWarning(
                    "Login failed. User not found: {UserName}",
                    request.UserName);

                return ApiResponse<LoginResponse>.FailureResponse(
    "Invalid username or password.");
            }

            bool validPassword = BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash);

            if (!validPassword)
            {
                _logger.LogWarning(
                    "Login failed. Invalid password for {UserName}",
                    request.UserName);

                return ApiResponse<LoginResponse>.FailureResponse(
     "Invalid username or password.");
            }

            _logger.LogInformation(
    "Login successful. UserId: {UserId}",
    user.UserId);

            var refreshToken = GenerateRefreshToken();

            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.UserId,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            await _refreshTokenRepository.AddAsync(refreshTokenEntity);

            var response = _mapper.Map<LoginResponse>(user);

            response.Token = GenerateJwtToken(user);
            response.RefreshToken = refreshToken;

            return ApiResponse<LoginResponse>.SuccessResponse(
                response,
                "Login successful");
        }

        public async Task<ApiResponse<object>> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            _logger.LogInformation(
                "Forgot password request for email: {Email}",
                request.Email);

            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null)
            {
                _logger.LogWarning(
                    "Forgot password failed. Email not found: {Email}",
                    request.Email);

                return ApiResponse<object>.FailureResponse("Email not found.");
            }

            _logger.LogInformation(
                "Forgot password verification successful for {Email}",
                request.Email);

            return ApiResponse<object>.SuccessResponse(null,"Email verified. Please call reset-password API to set a new password.");
        }

        public async Task<ApiResponse<object>> ResetPasswordAsync(
    ResetPasswordRequest request)
        {
            _logger.LogInformation(
            "Reset password request for email: {Email}",
             request.Email);

            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null)
            {
                _logger.LogWarning(
                     "Reset password failed. Email not found: {Email}",
                      request.Email);
                return ApiResponse<object>.FailureResponse(
    "Email not found.");
            }
               

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            await _userRepository.UpdateUserAsync(user);

            _logger.LogInformation(
        "Password reset successfully for UserId: {UserId}",
        user.UserId);

            return ApiResponse<object>.SuccessResponse(
     null,
     "Password reset successfully.");
        }

        public async Task<ApiResponse<object>> ChangePasswordAsync(string userName,ChangePasswordRequest request)
        {
            _logger.LogInformation(
                "Change password request for username: {UserName}",
                userName);

            var user = await _userRepository.GetByUserNameAsync(userName);

            if (user == null)
            {
                _logger.LogWarning(
                    "Change password failed. User not found: {UserName}",
                    userName);

                return ApiResponse<object>.FailureResponse(
    "User not found.");
            }

            bool validPassword = BCrypt.Net.BCrypt.Verify(
                request.CurrentPassword,
                user.PasswordHash);

            if (!validPassword)
            {
                _logger.LogWarning(
                    "Change password failed. Incorrect current password for {UserName}",
                    userName);

                return ApiResponse<object>.FailureResponse(
    "Current password is incorrect.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            await _userRepository.UpdateUserAsync(user);

            _logger.LogInformation(
                "Password changed successfully for UserId: {UserId}",
                user.UserId);

            return ApiResponse<object>.SuccessResponse(
     null,
     "Password changed successfully.");
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(
                System.Security.Cryptography.RandomNumberGenerator.GetBytes(64));
        }
        public async Task<ApiResponse<RefreshTokenResponse>> RefreshTokenAsync(
    RefreshTokenRequest request)
        {
            _logger.LogInformation(
                "Refresh token request received.");

            var storedToken = await _refreshTokenRepository
                .GetByTokenAsync(request.RefreshToken);

            if (storedToken == null)
            {
                _logger.LogWarning(
                    "Invalid refresh token.");

                return ApiResponse<RefreshTokenResponse>.FailureResponse(
                    "Invalid refresh token.");
            }

            if (storedToken.Revoked != null)
            {
                _logger.LogWarning(
                    "Refresh token already revoked.");

                return ApiResponse<RefreshTokenResponse>.FailureResponse(
                    "Refresh token has been revoked.");
            }

            if (storedToken.Expires <= DateTime.UtcNow)
            {
                _logger.LogWarning(
                    "Refresh token expired.");

                return ApiResponse<RefreshTokenResponse>.FailureResponse(
                    "Refresh token has expired.");
            }

            storedToken.Revoked = DateTime.UtcNow;

            await _refreshTokenRepository.UpdateAsync(storedToken);

            var newJwtToken = GenerateJwtToken(storedToken.User);

            var newRefreshToken = GenerateRefreshToken();


            var refreshTokenEntity = new RefreshToken
            {
                Token = newRefreshToken,
                UserId = storedToken.UserId,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            await _refreshTokenRepository.AddAsync(refreshTokenEntity);

            var response = new RefreshTokenResponse
            {
                Token = newJwtToken,
                RefreshToken = newRefreshToken
            };

            _logger.LogInformation(
                "Refresh token rotated successfully. UserId: {UserId}",
                storedToken.UserId);

            return ApiResponse<RefreshTokenResponse>.SuccessResponse(
                response,
                "Token refreshed successfully.");
        }

        public async Task<ApiResponse<object>> LogoutAsync(
    LogoutRequest request)
        {
            _logger.LogInformation("Logout request received.");

            var refreshToken = await _refreshTokenRepository
                .GetByTokenAsync(request.RefreshToken);

            if (refreshToken == null)
            {
                _logger.LogWarning("Invalid refresh token.");

                return ApiResponse<object>.FailureResponse(
                    "Invalid refresh token.");
            }

            if (refreshToken.Revoked != null)
            {
                return ApiResponse<object>.FailureResponse(
                    "User already logged out.");
            }

            refreshToken.Revoked = DateTime.UtcNow;

            await _refreshTokenRepository.UpdateAsync(refreshToken);

            _logger.LogInformation(
                "User logged out successfully. UserId: {UserId}",
                refreshToken.UserId);

            return ApiResponse<object>.SuccessResponse(
                null,
                "Logout successful.");
        }
    }
}