using CableManagementStudio.DTOs.Auth;
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
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var response = await _authService.RegisterAsync(request);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);

            if (!response.Success)
                return Unauthorized(response);

            return Ok(response);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(
    RefreshTokenRequest request)
        {
            var response = await _authService.RefreshTokenAsync(request);

            if (!response.Success)
                return Unauthorized(response);

            return Ok(response);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(
            ForgotPasswordRequest request)
        {
            var response = await _authService.ForgotPasswordAsync(request);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(
            ResetPasswordRequest request)
        {
            var response = await _authService.ResetPasswordAsync(request);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(
            ChangePasswordRequest request)
        {
            var userName = User.Identity?.Name;

            if (string.IsNullOrEmpty(userName))
                return Unauthorized();

            var response = await _authService.ChangePasswordAsync(
                userName,
                request);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout(
    LogoutRequest request)
        {
            var response = await _authService.LogoutAsync(request);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
    }
}