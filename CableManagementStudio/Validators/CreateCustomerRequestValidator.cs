using CableManagementStudio.DTOs.Customer;
using FluentValidation;

namespace CableManagementStudio.Validators
{
    public class CreateCustomerRequestValidator : AbstractValidator<CreateCustomerRequest>
    {
        public CreateCustomerRequestValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty()
                .WithMessage("Full name is required.");

            RuleFor(x => x.UserName)
                .NotEmpty()
                .WithMessage("Username is required.");

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required.")
                .EmailAddress()
                .WithMessage("Invalid email address.");

            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("Password is required.")
                .MinimumLength(6)
                .WithMessage("Password must be at least 6 characters.");

            RuleFor(x => x.Mobile)
                .NotEmpty()
                .WithMessage("Mobile number is required.");

            RuleFor(x => x.Address)
                .NotEmpty()
                .WithMessage("Address is required.");

            RuleFor(x => x.ConnectionNumber)
                .NotEmpty()
                .WithMessage("Connection number is required.");

            RuleFor(x => x.PackageId)
                .GreaterThan(0)
                .WithMessage("Please select a valid package.");
        }
    }
}