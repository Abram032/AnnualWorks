using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Enums;
using NCU.AnnualWorks.Core.Options;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using NCU.AnnualWorks.Integrations.Email.Core;
using NCU.AnnualWorks.Integrations.Email.Core.Models;
using NCU.AnnualWorks.Integrations.Usos.Core;
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
        private readonly ApplicationOptions _options;
        private readonly IUsosService _usosService;
        private readonly IEmailService _emailService;
        public ReviewService(IReviewRepository reviewRepository, IUserContext userContext, IUserRepository userRepository,
            IThesisRepository thesisRepository, IOptions<ApplicationOptions> options, IUsosService usosService,
            IEmailService emailService)
        {
            _reviewRepository = reviewRepository;
            _userContext = userContext;
            _userRepository = userRepository;
            _thesisRepository = thesisRepository;
            _options = options.Value;
            _usosService = usosService;
            _emailService = emailService;
        }

        public async Task CancelReviewConfirmation(Guid reviewGuid)
        {
            var review = await _reviewRepository.GetAsync(reviewGuid);
            var thesis = await _thesisRepository.GetAsync(review.ThesisId);
            var user = await _userRepository.GetAsync(_userContext.CurrentUser.Id);

            review.IsConfirmed = false;
            thesis.LogChange(user, ModificationType.ReviewCanceled);

            await _reviewRepository.UpdateAsync(review);

            await SendEmailCancelReview(reviewGuid);
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

        public async Task SendEmailCancelReview(Guid reviewGuid)
        {
            var review = await _reviewRepository.GetAsync(reviewGuid);
            var user = await _usosService.GetUser(_userContext.GetCredentials(), review.CreatedBy.UsosId);
            await _emailService.SendEmailReviewCanceled(new ReviewCanceledEmailModel
            {
                UserId = review.CreatedBy.Id,
                Email = user.Email ?? review.CreatedBy.Email,
                ThesisTitle = review.Thesis.Title,
                Url = $"{_options.ApplicationUrl}/details/{review.Thesis.Guid}"
            });
        }
    }
}
