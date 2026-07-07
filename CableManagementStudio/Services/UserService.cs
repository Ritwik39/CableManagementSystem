using CableManagementStudio.Models;
using CableManagementStudio.Repositories.Interfaces;
using CableManagementStudio.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CableManagementStudio.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public UserService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<string> RegisterAsync(RegisterRequest request)
        {
            var existingEmail = await _userRepository.GetByEmailAsync(request.Email);

            if (existingEmail != null)
                return "Email already exists";

            var existingUserName = await _userRepository.GetByUserNameAsync(request.UserName);

            if (existingUserName != null)
                return "Username already exists";

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

            return "User registered successfully";
        }

        public async Task<string?> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByUserNameAsync(request.UserName);

            if (user == null)
                return null;

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isPasswordValid)
                return null;

            return GenerateJwtToken(user);
        }

        public async Task<string> ForgotPasswordAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);

            if (user == null)
                return "Email not found";

            return "Password reset link sent to email";
        }

        public async Task<string> ChangePasswordAsync(ChangePasswordRequest request)
        {
            var user = await _userRepository.GetByUserNameAsync(request.UserName);

            if (user == null)
                return "User not found";

            bool isOldPasswordValid = BCrypt.Net.BCrypt.Verify(
                request.CurrentPassword,
                user.PasswordHash
            );

            if (!isOldPasswordValid)
                return "Current password is incorrect";

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            await _userRepository.UpdateUserAsync(user);

            return "Password changed successfully";
        }

        public async Task<string> ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null)
                return "User not found";

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            await _userRepository.UpdateUserAsync(user);

            return "Password reset successfully";
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}