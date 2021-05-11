using AutoMapper;
using NCU.AnnualWorks.Core.Models.Dto.Terms;
using NCU.AnnualWorks.Core.Models.Dto.Users;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using System.Linq;

namespace NCU.AnnualWorks.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<TermDTO, UsosTerm>();
            CreateMap<UsosTerm, TermDTO>();

            CreateMap<UsosUser, UserDTO>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(e => e.PhotoUrls.FirstOrDefault().Value));
        }
    }
}
