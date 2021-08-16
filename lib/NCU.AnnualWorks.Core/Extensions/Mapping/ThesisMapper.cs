using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto;
using System.Linq;

namespace NCU.AnnualWorks.Core.Extensions.Mapping
{
    public static class ThesisMapper
    {
        public static ThesisDTO ToBasicDto(this Thesis thesis)
        {
            return new ThesisDTO
            {
                Guid = thesis.Guid,
                Title = thesis.Title,
                Abstract = thesis.Abstract,
                ThesisKeywords = thesis.ThesisKeywords.ToDto().ToList(),
                FileGuid = thesis.File.Guid,
                CreatedAt = thesis.CreatedAt,
                Grade = thesis.Grade
            };
        }
    }
}
