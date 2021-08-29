using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto;
using NCU.AnnualWorks.Core.Models.Dto.Thesis;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Services
{
    public interface IThesisService
    {
        Task<ThesisActionsDTO> GetAvailableActions(Thesis thesis, DateTime deadline);
        Task<ThesisActionsDTO> GetAvailableActions(Guid thesisGuid, DateTime deadline);
        Task IncludeAvailableActions(IEnumerable<ThesisDTO> theses, DateTime deadline);
        List<ThesisDTO> GetPromotedTheses(long userId, string termId);
        List<ThesisDTO> GetReviewedTheses(long userId, string termId);
        List<ThesisDTO> GetAuthoredTheses(long userId, string termId);
        List<ThesisDTO> GetThesesByTerm(string termId);
        Task<Guid?> GetReviewGuid(Guid thesisGuid, long userId);
        bool ThesisExists(Guid thesisGuid);
        Task<List<ThesisLogDTO>> GetThesisLogs(Guid thesisGuid);
        Task<List<string>> GetAvailableGrades(Guid thesisGuid);
    }
}
