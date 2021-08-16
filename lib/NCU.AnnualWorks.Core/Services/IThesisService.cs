using NCU.AnnualWorks.Core.Models;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Services
{
    public interface IThesisService
    {
        ThesisActionsDTO GetAvailableActions(Thesis thesis, CurrentUser currentUser, DateTime deadline);
        Task<ThesisActionsDTO> GetAvailableActions(Guid thesisGuid, CurrentUser currentUser, DateTime deadline);
        Task IncludeAvailableActions(IEnumerable<ThesisDTO> theses, CurrentUser currentUser, DateTime deadline);
        List<Thesis> GetPromotedTheses(long userId, string termId);
        List<Thesis> GetReviewedTheses(long userId, string termId);
        List<Thesis> GetAuthoredTheses(long userId, string termId);
        List<Thesis> GetThesesByTerm(string termId);
        Task<Guid?> GetReviewGuid(Guid thesisGuid, long userId);
        bool ThesisExists(Guid thesisGuid);
    }
}
