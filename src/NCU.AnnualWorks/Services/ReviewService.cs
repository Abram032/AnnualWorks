using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Enums;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IUserContext _userContext;
        private readonly IUserRepository _userRepository;
        private readonly IThesisRepository _thesisRepository;
        public ReviewService(IReviewRepository reviewRepository, IUserContext userContext, IUserRepository userRepository, IThesisRepository thesisRepository)
        {
            _reviewRepository = reviewRepository;
            _userContext = userContext;
            _userRepository = userRepository;
            _thesisRepository = thesisRepository;
        }

        public async Task CancelReviewConfirmation(Guid reviewGuid)
        {
            var review = await _reviewRepository.GetAsync(reviewGuid);
            var thesis = await _thesisRepository.GetAsync(review.ThesisId);
            var user = await _userRepository.GetAsync(_userContext.CurrentUser.Id);

            review.IsConfirmed = false;
            thesis.LogChange(user, ModificationType.ReviewCanceled);

            await _reviewRepository.UpdateAsync(review);
        }

        public async Task<Review> GetAsync(Guid reviewGuid)
        {
            return await _reviewRepository.GetAsync(reviewGuid);
        }

        public async Task<bool> IsReviewConfirmed(Guid reviewGuid)
        {
            var review = await _reviewRepository.GetAsync(reviewGuid);
            return review.IsConfirmed;
        }

        public bool ReviewExists(Guid reviewGuid)
        {
            return _reviewRepository.GetAll().FirstOrDefault(r => r.Guid == reviewGuid) != null;
        }
    }
}
