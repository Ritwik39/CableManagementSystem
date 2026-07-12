using AutoMapper;
using CableManagementStudio.DTOs.Auth;
using CableManagementStudio.Models;

namespace CableManagementStudio.Mappings
{
    public class AuthProfile : Profile
    {
        public AuthProfile()
        {
            CreateMap<RegisterRequest, User>();
            CreateMap<User, LoginResponse>();
        }
    }
}