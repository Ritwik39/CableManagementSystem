using CableManagementStudio.Models;
using CableManagementStudio.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CableManagementStudio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : ControllerBase
    {
        private readonly IPackageService _packageService;

        public PackageController(IPackageService packageService)
        {
            _packageService = packageService;
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var packages = await _packageService.GetAllAsync();

            return Ok(packages);
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var package = await _packageService.GetByIdAsync(id);

            if (package == null)
                return NotFound("Package not found.");

            return Ok(package);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Package package)
        {
            var createdPackage = await _packageService.CreateAsync(package);

            return Ok(createdPackage);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Package package)
        {
            if (id != package.PackageId)
                return BadRequest("Package ID mismatch.");

            var updatedPackage = await _packageService.UpdateAsync(id, package);

            if (updatedPackage == null)
                return NotFound("Package not found.");

            return Ok(updatedPackage);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _packageService.DeleteAsync(id);

            if (!deleted)
                return NotFound("Package not found.");

            return Ok("Package deleted successfully.");
        }
    }
}