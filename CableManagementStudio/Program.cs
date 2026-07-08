using CableManagementStudio.Data;
using CableManagementStudio.Extensions;
using CableManagementStudio.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


// =======================
// Add MVC Controllers
// =======================
builder.Services.AddControllers();


// =======================
// Database Configuration
// =======================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));


// =======================
// Register Dependency Injection
// (Repositories, Services, EmailService, Singleton etc.)
// =======================
builder.Services.AddApplicationServices();

//AutoMapper

builder.Services.AddAutoMapper(typeof(Program));


// =======================
// Configure JWT Authentication
// =======================
builder.Services.AddJwtAuthentication(builder.Configuration);


// =======================
// Configure Role-Based Authorization
// =======================
builder.Services.AddAuthorization();


// =======================
// Configure Swagger + JWT Authorization
// =======================
builder.Services.AddSwaggerDocumentation();


var app = builder.Build();


// =======================
// Enable Swagger in Development
// =======================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// =======================
// Global Exception Middleware
// =======================
app.UseMiddleware<ExceptionMiddleware>();


// =======================
// HTTPS Redirection
// =======================
app.UseHttpsRedirection();


// =======================
// Authentication Middleware
// =======================
app.UseAuthentication();


// =======================
// Authorization Middleware
// =======================
app.UseAuthorization();


// =======================
// Map Controllers
// =======================
app.MapControllers();

app.Run();