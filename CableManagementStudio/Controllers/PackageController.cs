using CableManagementStudio.Data;
using CableManagementStudio.Models;
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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Packages.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var package = await _context.Packages.FindAsync(id);

            if (package == null)
                return NotFound();

            return Ok(package);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Package package)
        {
            _context.Packages.Add(package);
            await _context.SaveChangesAsync();

            return Ok(package);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Package package)
        {
            if (id != package.PackageId)
                return BadRequest();

            _context.Entry(package).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(package);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var package = await _context.Packages.FindAsync(id);

            if (package == null)
                return NotFound();

            _context.Packages.Remove(package);
            await _context.SaveChangesAsync();

            return Ok("Package deleted successfully.");
        }
    }
}