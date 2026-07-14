using CableManagementStudio.Repositories;
using CableManagementStudio.Repositories.Interfaces;
using CableManagementStudio.Services;
using CableManagementStudio.Services.Interfaces;

namespace CableManagementStudio.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Repositories
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IPackageRepository, PackageRepository>();

            // Services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IPackageService, PackageService>();

            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

            // Transient
            services.AddTransient<IEmailService, EmailService>();

            // Singleton
            services.AddSingleton<IApplicationInfoService, ApplicationInfoService>();

            return services;
        }
    }
}