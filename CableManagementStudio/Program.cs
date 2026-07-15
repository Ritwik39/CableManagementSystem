using CableManagementStudio.Data;
using CableManagementStudio.Extensions;
using CableManagementStudio.Middleware;
using CableManagementStudio.Repositories;
using CableManagementStudio.Repositories.Interfaces;
using CableManagementStudio.Services;
using CableManagementStudio.Services.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;

var builder = WebApplication.CreateBuilder(args);

// =======================
// Add MVC Controllers
// =======================
builder.Services.AddControllers();

// =======================
// Register Payment Dependencies
// =======================
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

// =======================
// Database Configuration
// =======================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// =======================
// Register Dependency Injection
// =======================
builder.Services.AddApplicationServices();

// =======================
// AutoMapper
// =======================
builder.Services.AddAutoMapper(typeof(Program));

// =======================
// FluentValidation
// =======================
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();

// =======================
// Configure JWT Authentication
// =======================
builder.Services.AddJwtAuthentication(builder.Configuration);

// =======================
// Configure Role-Based Authorization
// =======================
builder.Services.AddAuthorization();

// =======================
// Configure Swagger + JWT
// =======================
builder.Services.AddSwaggerDocumentation();

// =======================
// Configure CORS for Angular
// =======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// =======================
// Enable Swagger
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
// Enable CORS
// Must come before Authentication and Authorization
// =======================
app.UseCors("AllowAngularApp");

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