using CableManagementStudio.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CableManagementStudio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemController : ControllerBase
    {
        private readonly IApplicationInfoService _applicationInfoService;

        public SystemController(IApplicationInfoService applicationInfoService)
        {
            _applicationInfoService = applicationInfoService;
        }

        [HttpGet("info")]
        public IActionResult GetInfo()
        {
            return Ok(new
            {
                Version = _applicationInfoService.GetVersion(),
                Environment = _applicationInfoService.GetEnvironment(),
                StartedAt = _applicationInfoService.StartedAt
            });
        }
    }
}