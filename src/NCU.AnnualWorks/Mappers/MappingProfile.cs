using AutoMapper;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto;
using NCU.AnnualWorks.Core.Models.Dto.Keywords;
using NCU.AnnualWorks.Core.Models.Dto.Terms;
using NCU.AnnualWorks.Core.Models.Dto.Thesis;
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
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(e => e.PhotoUrls.FirstOrDefault().Value))
                .ForMember(dest => dest.UsosId, opt => opt.MapFrom(e => e.Id));

            CreateMap<UserDTO, User>();
            CreateMap<User, UserDTO>();

            CreateMap<UsosUser, User>()
                .ForMember(dest => dest.UsosId, opt => opt.MapFrom(e => e.Id));

            CreateMap<Keyword, KeywordDTO>();
            CreateMap<ThesisKeyword, KeywordDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(e => e.Keyword.Id))
                .ForMember(dest => dest.Text, opt => opt.MapFrom(e => e.Keyword.Text));
            CreateMap<File, ThesisFileDTO>();
            CreateMap<ThesisAdditionalFile, ThesisFileDTO>()
                .ForMember(dest => dest.Guid, opt => opt.MapFrom(e => e.File.Guid))
                .ForMember(dest => dest.FileName, opt => opt.MapFrom(e => e.File.FileName))
                .ForMember(dest => dest.Extension, opt => opt.MapFrom(e => e.File.Extension))
                .ForMember(dest => dest.ContentType, opt => opt.MapFrom(e => e.File.ContentType))
                .ForMember(dest => dest.Size, opt => opt.MapFrom(e => e.File.Size));
            CreateMap<ThesisLog, ThesisLogDTO>();
            CreateMap<Thesis, ThesisDTO>()
                .ForMember(dest => dest.ThesisAuthors, opt => opt.Ignore())
                .ForMember(dest => dest.Promoter, opt => opt.Ignore())
                .ForMember(dest => dest.Reviewer, opt => opt.Ignore())
                .ForMember(dest => dest.ThesisLogs, opt => opt.Ignore());
        }
    }
}
