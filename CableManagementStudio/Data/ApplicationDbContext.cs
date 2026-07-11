using Microsoft.EntityFrameworkCore;
using CableManagementStudio.Models;
using System.Collections.Generic;

namespace CableManagementStudio.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Package> Packages { get; set; }
    }
}