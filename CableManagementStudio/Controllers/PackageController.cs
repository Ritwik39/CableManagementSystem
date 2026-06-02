using CableManagementStudio.Data;
using CableManagementStudio.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CableManagementStudio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PackageController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Packages.ToListAsync());
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var package = await _context.Packages.FindAsync(id);

            if (package == null)
                return NotFound("Package not found.");

            return Ok(package);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Package package)
        {
            _context.Packages.Add(package);
            await _context.SaveChangesAsync();

            return Ok(package);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Package package)
        {
            if (id != package.PackageId)
                return BadRequest("Package ID mismatch.");

            _context.Entry(package).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(package);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var package = await _context.Packages.FindAsync(id);

            if (package == null)
                return NotFound("Package not found.");

            _context.Packages.Remove(package);
            await _context.SaveChangesAsync();

            return Ok("Package deleted successfully.");
        }
    }
}