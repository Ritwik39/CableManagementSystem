using CableManagementStudio.Data;
using CableManagementStudio.DTOs.Customer;
using CableManagementStudio.Models;
using CableManagementStudio.Services;
using CableManagementStudio.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CableManagementStudio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        //private readonly ApplicationDbContext _context;
        //private readonly IEmailService _emailService;

       // private readonly ApplicationDbContext _context;
        private readonly ICustomerService _customerService;
        private readonly IEmailService _emailService;

        public CustomerController(
            ICustomerService customerService,
            IEmailService emailService)
        {
           // _context = context;
            _customerService = customerService;
            _emailService = emailService;
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            //throw new Exception("Testing Serilog "); // for testing Middleware   


            var customers = await _customerService.GetAllAsync();
            return Ok(customers);
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var customer = await _customerService.GetByIdAsync(id);

            if (customer == null)
                return NotFound("Customer not found.");

            return Ok(customer);
        }

        //[Authorize(Roles = "Admin,Employee")]
        //[HttpPost]
        //public async Task<IActionResult> Create(Customer customer)
        //{
        //    _context.Customers.Add(customer);
        //    await _context.SaveChangesAsync();

        //    return Ok(customer);
        //}
        [Authorize(Roles = "Admin,Employee")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateCustomerRequest request)
            {
                var result = await _customerService.RegisterCustomerAsync(request);

                return Ok(result);
            }

            //// Check existing username
            //var existingUser = await _context.Users
            //    .FirstOrDefaultAsync(x => x.UserName == request.UserName);

            //if (existingUser != null)
            //    return BadRequest("Username already exists.");

            //// Create login account
            //var user = new User
            //{
            //    FullName = request.FullName,
            //    UserName = request.UserName,
            //    Email = request.Email,
            //    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            //    Role = "Customer",
            //    IsActive = true
            //};

            //_context.Users.Add(user);
            //await _context.SaveChangesAsync();

            //// Create customer record
            //var customer = new Customer
            //{
            //    UserId = user.UserId,
            //    Name = request.FullName,
            //    Mobile = request.Mobile,
            //    Address = request.Address,
            //    ConnectionNumber = request.ConnectionNumber,
            //    PackageId = request.PackageId,
            //    IsActive = true
            //};

            //_context.Customers.Add(customer);
            //await _context.SaveChangesAsync();

            //return Ok(new
            //{
            //    Message = "Customer created successfully.",
            //    CustomerId = customer.CustomerId,
            //    UserId = user.UserId
            //});
        

        [Authorize(Roles = "Admin,Employee")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Customer customer)
        {
            var updateCustomer = await _customerService.UpdateAsync(id, customer); // moved to the service layer.

            if(updateCustomer == null)
            
                return NotFound("Customer Not found");

            return Ok(updateCustomer);
            

            //if (id != customer.CustomerId)
            //    return BadRequest("Customer ID mismatch.");

            //_context.Entry(customer).State = EntityState.Modified;
            //await _context.SaveChangesAsync();

            //return Ok(customer);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _customerService.DeleteAsync(id);

            if (!deleted)
                return NotFound("Customer not found.");

            return Ok("Customer deleted successfully.");
        }

        [Authorize(Roles = "Customer")]
        [HttpGet("my-profile")]
        public async Task<IActionResult> MyProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            var profile = await _customerService.GetProfileAsync(userId);

            if (profile == null)
            {
                return NotFound(new
                {
                    Message = "Customer profile not created yet. Please contact administrator."
                });
            }

            return Ok(profile);
        }
    }
}