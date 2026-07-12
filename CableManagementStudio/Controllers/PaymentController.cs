using CableManagementStudio.Models;
using CableManagementStudio.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CableManagementStudio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var payments = await _paymentService.GetAllAsync();
            return Ok(payments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var payment = await _paymentService.GetByIdAsync(id);

            if (payment == null)
                return NotFound("Payment not found");

            return Ok(payment);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomerId(int customerId)
        {
            var payments = await _paymentService.GetByCustomerIdAsync(customerId);
            return Ok(payments);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreatePaymentRequest request)
        {
            var payment = await _paymentService.CreateAsync(request);

            return Ok(new
            {
                Success = true,
                Message = "Payment added successfully",
                Data = payment
            });
        }
    }
}