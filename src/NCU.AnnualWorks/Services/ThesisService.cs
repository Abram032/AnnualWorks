using NCU.AnnualWorks.Core.Extensions.Mapping;
using NCU.AnnualWorks.Core.Models;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto;
using NCU.AnnualWorks.Core.Models.Dto.Thesis;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using NCU.AnnualWorks.Integrations.Usos.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Services
{
    public class ThesisService : IThesisService
    {
        private readonly IThesisRepository _thesisRepository;
        private readonly IUsosService _usosService;

        public ThesisService(IThesisRepository thesisRepository, IUsosService usosService)
        {
            _thesisRepository = thesisRepository;
            _usosService = usosService;
        }

        public ThesisActionsDTO GetAvailableActions(Thesis thesis, CurrentUser currentUser, DateTime deadline)
        {
            var isAuthor = thesis.ThesisAuthors.Any(a => a.AuthorId == currentUser.Id);
            var isPromoter = thesis.Promoter.Id == currentUser.Id;
            var isReviewer = thesis.Reviewer.Id == currentUser.Id;
            var promoterReview = thesis.Reviews.FirstOrDefault(r => r.CreatedBy == thesis.Promoter);
            var reviewerReview = thesis.Reviews.FirstOrDefault(r => r.CreatedBy == thesis.Reviewer);
            var userReview = thesis.Reviews.FirstOrDefault(r => r.CreatedBy.Id == currentUser.Id);
            var userReviewExists = userReview != null;
            var isPastDeadline = deadline < DateTime.Now;

            return new ThesisActionsDTO
            {
                CanView = isAuthor || currentUser.IsEmployee,
                CanDownload = isAuthor || currentUser.IsEmployee,
                CanPrint = isAuthor || currentUser.IsEmployee,
                CanAddReview = currentUser.IsEmployee && (isPromoter || isReviewer) && !userReviewExists && !isPastDeadline,
                CanEditReview = currentUser.IsEmployee && (isPromoter || isReviewer) && userReviewExists && !userReview.IsConfirmed && !isPastDeadline,
                CanEdit = (!isPastDeadline && currentUser.IsAdmin) ||
                    (
                        currentUser.IsEmployee &&
                        !isPastDeadline &&
                        isPromoter &&
                        (promoterReview == null || !promoterReview.IsConfirmed) &&
                        (reviewerReview == null || !reviewerReview.IsConfirmed)
                    ),
                CanEditGrade = currentUser.IsEmployee &&
                    isPromoter &&
                    thesis.Grade == null &&
                    promoterReview != null &&
                    reviewerReview != null &&
                    promoterReview.IsConfirmed &&
                    reviewerReview.IsConfirmed &&
                    !isPastDeadline
            };
        }

        public async Task<ThesisActionsDTO> GetAvailableActions(Guid thesisGuid, CurrentUser currentUser, DateTime deadline)
        {
            var thesis = await _thesisRepository.GetAsync(thesisGuid);
            return GetAvailableActions(thesis, currentUser, deadline);
        }

        public async Task IncludeAvailableActions(IEnumerable<ThesisDTO> theses, CurrentUser currentUser, DateTime deadline)
        {
            foreach (var thesis in theses)
            {
                thesis.Actions = await GetAvailableActions(thesis.Guid, currentUser, deadline);
            }
        }

        public List<ThesisDTO> GetThesesByTerm(string termId) =>
            _thesisRepository.GetAll().Where(t => t.TermId == termId).ToBasicDto();

        public List<ThesisDTO> GetPromotedTheses(long userId, string termId) =>
            _thesisRepository.GetAll().Where(t => t.Promoter.Id == userId && t.TermId == termId).ToBasicDto();

        public List<ThesisDTO> GetReviewedTheses(long userId, string termId) =>
            _thesisRepository.GetAll().Where(t => t.Reviewer.Id == userId && t.TermId == termId).ToBasicDto();

        public List<ThesisDTO> GetAuthoredTheses(long userId, string termId) =>
            _thesisRepository.GetAll().Where(t => t.ThesisAuthors.Select(a => a.AuthorId).Contains(userId) && t.TermId == termId).ToBasicDto();

        public async Task<Guid?> GetReviewGuid(Guid thesisGuid, long userId) =>
            (await _thesisRepository.GetAsync(thesisGuid))?.Reviews?.FirstOrDefault(r => r.CreatedBy.Id == userId)?.Guid;

        public bool ThesisExists(Guid thesisGuid) => _thesisRepository.GetAll().Any(p => p.Guid == thesisGuid);

        public async Task<List<ThesisLogDTO>> GetThesisLogs(Guid thesisGuid, CurrentUser currentUser)
        {
            var thesis = await _thesisRepository.GetAsync(thesisGuid);
            var usosUsersFromLogs = await _usosService.GetUsers(currentUser.OAuthCredentials, thesis.ThesisLogs.Select(p => p.User.UsosId).Distinct());
            var usersFromLogs = usosUsersFromLogs.ToDto();

            return thesis.ThesisLogs.Select(p => new ThesisLogDTO
            {
                Timestamp = p.Timestamp,
                ModificationType = p.ModificationType,
                User = usersFromLogs.FirstOrDefault(u => u.UsosId == p.User.UsosId)
            }).ToList();
        }
    }
}
