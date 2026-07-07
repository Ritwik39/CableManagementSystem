using CableManagementStudio.Models;
using CableManagementStudio.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CableManagementStudio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var result = await _userService.RegisterAsync(request);

            if (result == "Email already exists" || result == "Username already exists")
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var token = await _userService.LoginAsync(request);

            if (token == null)
                return Unauthorized("Invalid username or password.");

            return Ok(new
            {
                message = "Login successful",
                token = token
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            var result = await _userService.ForgotPasswordAsync(request.Email);

            if (result == "Email not found")
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            var result = await _userService.ResetPasswordAsync(request);

            if (result == "User not found")
                return BadRequest(result);

            return Ok(result);
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            var userName = User.Identity?.Name;

            if (string.IsNullOrEmpty(userName))
                return Unauthorized("Invalid token.");

            request.UserName = userName;

            var result = await _userService.ChangePasswordAsync(request);

            if (result == "User not found" || result == "Old password is incorrect")
                return BadRequest(result);

            return Ok(result);
        }
    }
}