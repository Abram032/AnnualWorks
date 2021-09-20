using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Api.Reviews.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto.Questions;
using NCU.AnnualWorks.Core.Models.Dto.Reviews;
using NCU.AnnualWorks.Core.Models.Enums;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using NCU.AnnualWorks.Core.Utils;
using NCU.AnnualWorks.Integrations.Email.Core;
using NCU.AnnualWorks.Integrations.Usos.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Reviews
{
    [Authorize(AuthorizationPolicies.AtLeastStudent)]
    public class ReviewsController : ApiControllerBase
    {
        private readonly IThesisRepository _thesisRepository;
        private readonly IUserRepository _userRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly IAsyncRepository<Question> _questionRepository;
        private readonly IAsyncRepository<Answer> _answerRepository;
        private readonly ISettingsService _settingsService;
        private readonly IUserContext _userContext;
        private readonly IUsosService _usosService;
        private readonly IReviewService _reviewService;
        private readonly IThesisService _thesisService;
        private readonly IEmailService _emailService;
        public ReviewsController(IReviewRepository reviewRepository,
            IThesisRepository thesisRepository, IUserRepository userRepository,
            IAsyncRepository<Question> questionRepository,
            IAsyncRepository<ThesisLog> thesisLogRepository,
            IFileService fileService, IAsyncRepository<Answer> answerRepository,
            ISettingsService settingsService, IUserContext userContext, IUsosService usosService,
            IReviewService reviewService, IThesisService thesisService, IEmailService emailService)
        {
            _reviewRepository = reviewRepository;
            _thesisRepository = thesisRepository;
            _userRepository = userRepository;
            _questionRepository = questionRepository;
            _answerRepository = answerRepository;
            _settingsService = settingsService;
            _userContext = userContext;
            _usosService = usosService;
            _reviewService = reviewService;
            _thesisService = thesisService;
            _emailService = emailService;
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetReview(Guid id)
        {
            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());
            var review = await _reviewRepository.GetAsync(id);
            if (review == null)
            {
                return new NotFoundResult();
            }

            var thesis = await _thesisRepository.GetAsync(review.Thesis.Guid);
            if (!thesis.ThesisAuthors.Any(p => p.Author == currentUser) && !HttpContext.IsCurrentUserEmployee())
            {
                return new ForbidResult();
            }

            var result = new ReviewDTO
            {
                Guid = review.Guid,
                Grade = review.Grade,
                IsConfirmed = review.IsConfirmed,
                QnAs = review.ReviewQnAs.Select(qna => new ReviewQnADTO
                {
                    Question = new QuestionDTO
                    {
                        Id = qna.Question.Id,
                        Text = qna.Question.Text,
                        Order = qna.Question.Order,
                        IsRequired = qna.Question.IsRequired
                    },
                    Answer = qna.Answer.Text
                }).ToList()
            };

            return new OkObjectResult(result);
        }

        [HttpPost]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> CreateReview([FromBody] ReviewRequest request)
        {
            var deadline = await _settingsService.GetDeadline(_userContext.GetCredentials());
            var currentTerm = await _usosService.GetCurrentTerm(_userContext.GetCredentials());
            var thesis = await _thesisRepository.GetAsync(request.ThesisGuid);
            var sendGradeConflictEmail = false;
            var sendGradeConfirmEmail = false;

            if (DateTime.Now > deadline && thesis.TermId != currentTerm.Id)
            {
                return new BadRequestObjectResult("Nie można dodać recenzji po upływie terminu końcowego.");
            }

            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());

            if (thesis == null)
            {
                return new NotFoundResult();
            }
            var isPromoter = thesis.Promoter == currentUser;
            var isReviewer = thesis.Reviewer == currentUser;

            //Current user is nor promoter neither reviewer
            if (!isPromoter && !isReviewer)
            {
                return new ForbidResult();
            }

            if (thesis.Reviews.Any(r => r.CreatedBy == currentUser))
            {
                return new ConflictObjectResult("Recenzja dla tej pracy już istnieje.");
            }

            var questionIds = request.QnAs.Keys;
            var questions = _questionRepository.GetAll().Where(q => questionIds.Contains(q.Id)).ToList();
            var activeQuestions = _questionRepository.GetAll().Where(q => q.IsActive).ToList();

            //Not all active questions have been answered
            if (!activeQuestions.Select(q => q.Id).All(questions.Select(q => q.Id).Distinct().Contains) || activeQuestions.Count != questions.Count)
            {
                return new BadRequestObjectResult("Nieprawidłowa lista pytań.");
            }

            if (request.IsConfirmed)
            {
                var requiredQuestions = activeQuestions.Where(p => p.IsRequired).Select(p => p.Id).ToList();
                if (requiredQuestions.Any(q => string.IsNullOrWhiteSpace(request.QnAs[q])))
                {
                    return new BadRequestObjectResult("Brak odpowiedzi na jedno lub więcej wymaganych pytań");
                }

                var reviewerReview = thesis.Reviews.FirstOrDefault(r => r.CreatedBy == thesis.Reviewer);
                var promoterReview = thesis.Reviews.FirstOrDefault(r => r.CreatedBy == thesis.Promoter);

                if ((isPromoter && reviewerReview != null && reviewerReview.IsConfirmed) ||
                    (isReviewer && promoterReview != null && promoterReview.IsConfirmed))
                {
                    var grades = new List<string>() { request.Grade, isPromoter ? reviewerReview.Grade : promoterReview.Grade };

                    if (GradeUtils.TryGetAverageGrade(grades, out var average))
                    {
                        thesis.Grade = average;
                        sendGradeConfirmEmail = true;
                    }
                    else
                    {
                        sendGradeConflictEmail = true;
                    }
                }
            }

            var reviewGuid = Guid.NewGuid();
            var review = new Review
            {
                Guid = reviewGuid,
                Thesis = thesis,
                CreatedBy = currentUser,
                Grade = request.Grade,
                IsConfirmed = request.IsConfirmed,
                ReviewQnAs = new List<ReviewQnA>()
            };

            foreach (var qna in request.QnAs)
            {
                review.ReviewQnAs.Add(new ReviewQnA
                {
                    Review = review,
                    Question = questions.First(q => q.Id == qna.Key),
                    Answer = new Answer
                    {
                        Text = qna.Value,
                        CreatedBy = currentUser
                    }
                });
            }

            await _reviewRepository.AddAsync(review);

            //Saving change to log
            thesis.LogChange(currentUser, ModificationType.ReviewAdded);
            if (request.IsConfirmed)
            {
                thesis.LogChange(currentUser, ModificationType.ReviewConfirmed);
            }
            await _thesisRepository.UpdateAsync(thesis);

            if (sendGradeConflictEmail)
            {
                await _thesisService.SendEmailGradeConflict(thesis.Guid);
            }
            if (sendGradeConfirmEmail)
            {
                await _thesisService.SendEmailGradeConfirmed(thesis.Guid);
            }

            return new CreatedResult("/reviews", reviewGuid);
        }

        [HttpPut("{id:guid}")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> UpdateReview(Guid id, ReviewRequest request)
        {
            var deadline = await _settingsService.GetDeadline(_userContext.GetCredentials());
            var currentTerm = await _usosService.GetCurrentTerm(_userContext.GetCredentials());
            var thesis = await _thesisRepository.GetAsync(request.ThesisGuid);
            var sendGradeConflictEmail = false;
            var sendGradeConfirmEmail = false;

            if (DateTime.Now > deadline || thesis.TermId != currentTerm.Id)
            {
                return new BadRequestObjectResult("Nie można zaktualizować recenzji po upływie terminu końcowego.");
            }

            var review = await _reviewRepository.GetAsync(id);
            if (review == null)
            {
                return new NotFoundResult();
            }

            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());
            if (thesis == null)
            {
                return new NotFoundResult();
            }
            var isPromoter = thesis.Promoter == currentUser;
            var isReviewer = thesis.Reviewer == currentUser;

            //Current user is not a creator of review
            if (currentUser != review.CreatedBy)
            {
                return new ForbidResult();
            }

            //Current user is nor promoter neither reviewer
            if (!isPromoter && !isReviewer)
            {
                return new ForbidResult();
            }

            if (review.IsConfirmed)
            {
                return new BadRequestObjectResult("Nie można edytować zatwierdzonej recenzji.");
            }

            var questionIds = request.QnAs.Keys;
            var questions = _questionRepository.GetAll().Where(q => questionIds.Contains(q.Id)).ToList();
            var activeQuestions = _questionRepository.GetAll().Where(q => q.IsActive).ToList();

            //Not all active questions have been answered
            if (!activeQuestions.Select(q => q.Id).All(questions.Select(q => q.Id).Distinct().Contains) || activeQuestions.Count != questions.Count)
            {
                return new BadRequestObjectResult("Nieprawidłowa lista pytań.");
            }

            if (request.IsConfirmed)
            {
                var requiredQuestions = activeQuestions.Where(p => p.IsRequired).Select(p => p.Id).ToList();
                if (requiredQuestions.Any(q => string.IsNullOrWhiteSpace(request.QnAs[q])))
                {
                    return new BadRequestObjectResult("Brak odpowiedzi na jedno lub więcej wymaganych pytań.");
                }

                var reviewerReview = thesis.Reviews.FirstOrDefault(r => r.CreatedBy == thesis.Reviewer);
                var promoterReview = thesis.Reviews.FirstOrDefault(r => r.CreatedBy == thesis.Promoter);

                if ((isPromoter && reviewerReview != null && reviewerReview.IsConfirmed) ||
                    (isReviewer && promoterReview != null && promoterReview.IsConfirmed))
                {
                    var grades = new List<string>() { request.Grade, isPromoter ? reviewerReview.Grade : promoterReview.Grade };

                    if (GradeUtils.TryGetAverageGrade(grades, out var average))
                    {
                        thesis.Grade = average;
                        sendGradeConfirmEmail = true;
                    }
                    else
                    {
                        sendGradeConflictEmail = true;
                    }
                }
            }

            review.ModifiedAt = DateTime.Now;
            review.ModifiedBy = currentUser;
            review.Grade = request.Grade;
            review.IsConfirmed = request.IsConfirmed;
            //Getting current answers for future removal
            var answersToRemove = review.ReviewQnAs.Select(a => a.Answer).ToList();
            review.ReviewQnAs.Clear();

            foreach (var qna in request.QnAs)
            {
                review.ReviewQnAs.Add(new ReviewQnA
                {
                    Review = review,
                    Question = questions.First(q => q.Id == qna.Key),
                    Answer = new Answer
                    {
                        Text = qna.Value,
                        CreatedBy = currentUser
                    }
                });
            }

            await _reviewRepository.UpdateAsync(review);
            await _answerRepository.RemoveRangeAsync(answersToRemove);

            //Saving change to log
            thesis.LogChange(currentUser, ModificationType.ReviewChanged);
            if (request.IsConfirmed)
            {
                thesis.LogChange(currentUser, ModificationType.ReviewConfirmed);
            }
            await _thesisRepository.UpdateAsync(thesis);

            if (sendGradeConflictEmail)
            {
                await _thesisService.SendEmailGradeConflict(thesis.Guid);
            }
            if (sendGradeConfirmEmail)
            {
                await _thesisService.SendEmailGradeConfirmed(thesis.Guid);
            }

            return new OkObjectResult(review.Guid);
        }

        [HttpPost("cancel/{id:guid}")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> CancelReview(Guid id)
        {
            var currentTerm = await _usosService.GetCurrentTerm(_userContext.GetCredentials());
            var deadline = await _settingsService.GetDeadline(_userContext.GetCredentials());

            if (!_reviewService.ReviewExists(id))
            {
                return new NotFoundObjectResult("Nie ma recenzji o podanym identyfikatorze.");
            }

            var review = await _reviewService.GetAsync(id);
            if (!review.IsConfirmed)
            {
                return new BadRequestObjectResult("Nie można anulować niezatwierdzonej recenzji.");
            }

            if (DateTime.Now > deadline || currentTerm.Id != review.Thesis.TermId)
            {
                return new BadRequestObjectResult("Nie można anulować recenzji po upływie terminu końcowego.");
            }

            await _reviewService.CancelReviewConfirmation(id);
            if (!string.IsNullOrEmpty(review.Thesis.Grade))
            {
                await _thesisService.CancelGrade(review.Thesis.Guid);
            }

            return new OkResult();
        }

        [HttpPost("updateQuestions/{id:guid}")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> UpdateReviewQuestions(Guid id)
        {
            var review = await _reviewRepository.GetAsync(id);
            var user = await _userRepository.GetAsync(_userContext.CurrentUser.Id);
            if (review == null)
            {
                return new NotFoundResult();
            }

            if (review.CreatedBy.Id != _userContext.CurrentUser.Id)
            {
                return new ForbidResult("Nie masz uprawnień do aktualizacji pytań recenzji.");
            }

            if (review.IsConfirmed)
            {
                return new BadRequestObjectResult("Nie można edytować zatwierdzonej recenzji.");
            }

            var questions = review.ReviewQnAs.Select(r => r.Question).ToList();
            var activeQuestions = _questionRepository.GetAll().Where(q => q.IsActive).ToList();

            //Not all active questions have been answered
            if (!activeQuestions.Select(q => q.Id).All(questions.Select(q => q.Id).Distinct().Contains) || activeQuestions.Count != questions.Count)
            {
                review.ReviewQnAs.Clear();
                review.ReviewQnAs = activeQuestions.Select(aq => new ReviewQnA
                {
                    Question = aq,
                    Answer = new Answer
                    {
                        Text = string.Empty,
                        CreatedBy = user,
                        CreatedAt = DateTime.Now
                    },
                    Review = review
                }).ToList();
                await _reviewRepository.UpdateAsync(review);
            }
            else
            {
                return new BadRequestObjectResult("Lista pytań jest aktualna.");
            }

            return new OkResult();
        }

        [HttpGet("validateQuestions/{id:guid}")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> ValidateReviewQuestions(Guid id)
        {
            var review = await _reviewRepository.GetAsync(id);
            if (review == null)
            {
                return new NotFoundResult();
            }

            if (review.CreatedBy.Id != _userContext.CurrentUser.Id)
            {
                return new ForbidResult("Nie masz uprawnień do weryfikacji pytań recenzji.");
            }

            var questions = review.ReviewQnAs.Select(r => r.Question).ToList();
            var activeQuestions = _questionRepository.GetAll().Where(q => q.IsActive).ToList();

            //Not all active questions have been answered
            if (!activeQuestions.Select(q => q.Id).All(questions.Select(q => q.Id).Distinct().Contains) || activeQuestions.Count != questions.Count)
            {
                return new OkObjectResult(true);
            }

            return new OkObjectResult(false);
        }
    }
}