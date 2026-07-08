using AutoMapper;
using CableManagementStudio.DTOs.Customer;
using CableManagementStudio.Models;

namespace CableManagementStudio.Mappings
{
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            CreateMap<CreateCustomerRequest, User>()
                .ForMember(dest => dest.FullName,
                    opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Email,
                    opt => opt.MapFrom(src => src.Email));

            CreateMap<CreateCustomerRequest, Customer>()
                .ForMember(dest => dest.Name,
                    opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Mobile,
                    opt => opt.MapFrom(src => src.Mobile))
                .ForMember(dest => dest.Address,
                    opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.ConnectionNumber,
                    opt => opt.MapFrom(src => src.ConnectionNumber))
                .ForMember(dest => dest.PackageId,
                    opt => opt.MapFrom(src => src.PackageId));
        }
    }
}