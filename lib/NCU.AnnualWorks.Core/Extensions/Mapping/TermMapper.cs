using NCU.AnnualWorks.Core.Models.Dto.Terms;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using System.Collections.Generic;
using System.Linq;

namespace NCU.AnnualWorks.Core.Extensions.Mapping
{
    public static class TermMapper
    {
        public static TermDTO ToDto(this UsosTerm usosTerm)
        {
            return new TermDTO
            {
                Id = usosTerm.Id,
                StartDate = usosTerm.StartDate,
                EndDate = usosTerm.EndDate,
                FinishDate = usosTerm.FinishDate,
                Names = usosTerm.Names
            };
        }

        public static List<TermDTO> ToDto(this IEnumerable<UsosTerm> usosTerms)
        {
            return usosTerms.Select(u => u.ToDto()).ToList();
        }
    }
}
