using NCU.AnnualWorks.Core.Models;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Services
{
    public class ThesisService : IThesisService
    {
        private readonly IThesisRepository _thesisRepository;

        public ThesisService(IThesisRepository thesisRepository)
        {
            _thesisRepository = thesisRepository;
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

        public List<Thesis> GetThesesByTerm(string termId) =>
            _thesisRepository.GetAll().Where(t => t.TermId == termId).ToList();

        public List<Thesis> GetPromotedTheses(long userId, string termId) =>
            _thesisRepository.GetAll().Where(t => t.Promoter.Id == userId && t.TermId == termId).ToList();

        public List<Thesis> GetReviewedTheses(long userId, string termId) =>
            _thesisRepository.GetAll().Where(t => t.Reviewer.Id == userId && t.TermId == termId).ToList();

        public List<Thesis> GetAuthoredTheses(long userId, string termId) =>
            _thesisRepository.GetAll().Where(t => t.ThesisAuthors.Select(a => a.AuthorId).Contains(userId) && t.TermId == termId).ToList();

        public async Task<Guid?> GetReviewGuid(Guid thesisGuid, long userId) =>
            (await _thesisRepository.GetAsync(thesisGuid))?.Reviews?.FirstOrDefault(r => r.CreatedBy.Id == userId)?.Guid;

        public bool ThesisExists(Guid thesisGuid) => _thesisRepository.GetAll().Any(p => p.Guid == thesisGuid);
    }
}
