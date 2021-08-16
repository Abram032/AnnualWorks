using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto.Keywords;
using System.Collections.Generic;
using System.Linq;

namespace NCU.AnnualWorks.Core.Extensions.Mapping
{
    public static class KeywordsMapper
    {
        public static KeywordDTO ToDto(this Keyword keyword)
        {
            return new KeywordDTO
            {
                Id = keyword.Id,
                Text = keyword.Text
            };
        }

        public static List<KeywordDTO> ToDto(this IEnumerable<Keyword> keywords)
        {
            return keywords.Select(k => k.ToDto()).ToList();
        }

        public static KeywordDTO ToDto(this ThesisKeyword thesisKeyword)
        {
            return new KeywordDTO
            {
                Id = thesisKeyword.Keyword.Id,
                Text = thesisKeyword.Keyword.Text
            };
        }

        public static List<KeywordDTO> ToDto(this IEnumerable<ThesisKeyword> thesisKeywords)
        {
            return thesisKeywords.Select(k => k.ToDto()).ToList();
        }
    }
}
