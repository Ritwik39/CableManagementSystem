using CableManagementStudio.Models;
using CableManagementStudio.Repositories.Interfaces;
using CableManagementStudio.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CableManagementStudio.DTOs.Auth;

namespace CableManagementStudio.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUserRepository userRepository,
            IConfiguration configuration,
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<string> RegisterAsync(RegisterRequest request)
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

                return "Email already exists";
            }

            var existingUserName = await _userRepository.GetByUserNameAsync(request.UserName);

            if (existingUserName != null)
            {
                _logger.LogWarning(
                    "Registration failed. Username already exists: {UserName}",
                    request.UserName);

                return "Username already exists";
            }

            var user = new User
            {
                FullName = request.FullName,
                UserName = request.UserName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Customer",
                IsActive = true
            };

            await _userRepository.AddUserAsync(user);

            _logger.LogInformation(
                "User registered successfully. UserId: {UserId}",
                user.UserId);

            return "User registered successfully";
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest request)
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

                return null;
            }

            bool validPassword = BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash);

            if (!validPassword)
            {
                _logger.LogWarning(
                    "Login failed. Invalid password for {UserName}",
                    request.UserName);

                return null;
            }

            _logger.LogInformation(
                "Login successful. UserId: {UserId}",
                user.UserId);

            return new LoginResponse
            {
                Message = "Login successful",
                Token = GenerateJwtToken(user),
                UserId = user.UserId,
                FullName = user.FullName,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<string> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null)
                return "Email not found.";

            return "Email verified. Please call reset-password API to set a new password.";
        }

        public async Task<string> ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null)
                return "Email not found.";

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            await _userRepository.UpdateUserAsync(user);

            return "Password reset successfully.";
        }

        public async Task<string> ChangePasswordAsync(
            string userName,
            ChangePasswordRequest request)
        {
            var user = await _userRepository.GetByUserNameAsync(userName);

            if (user == null)
                return "User not found.";

            bool validPassword = BCrypt.Net.BCrypt.Verify(
                request.CurrentPassword,
                user.PasswordHash);

            if (!validPassword)
                return "Current password is incorrect.";

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            await _userRepository.UpdateUserAsync(user);

            return "Password changed successfully.";
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
    }
}