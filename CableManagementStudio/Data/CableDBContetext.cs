using Microsoft.EntityFrameworkCore;
using Cable_Management_Systems.Models;
using System.Collections.Generic;

namespace Cable_Management_Systems.Data
{
    public class CableDbContext : DbContext
    {
        public CableDbContext(DbContextOptions<CableDbContext> options)
            : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Package> Packages { get; set; }

        // Add later when you create Payment model
        // public DbSet<Payment> Payments { get; set; }
    }
}