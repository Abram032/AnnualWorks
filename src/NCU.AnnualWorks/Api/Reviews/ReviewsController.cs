using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Api.Reviews.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto.Questions;
using NCU.AnnualWorks.Core.Models.Dto.Reviews;
using NCU.AnnualWorks.Core.Models.Enums;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
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
        private readonly IAsyncRepository<ThesisLog> _thesisLogRepository;
        private readonly IAsyncRepository<Answer> _answerRepository;
        private readonly IFileService _fileService;
        public ReviewsController(IReviewRepository reviewRepository,
            IThesisRepository thesisRepository, IUserRepository userRepository,
            IAsyncRepository<Question> questionRepository,
            IAsyncRepository<ThesisLog> thesisLogRepository,
            IFileService fileService, IAsyncRepository<Answer> answerRepository)
        {
            _reviewRepository = reviewRepository;
            _thesisRepository = thesisRepository;
            _userRepository = userRepository;
            _questionRepository = questionRepository;
            _thesisLogRepository = thesisLogRepository;
            _answerRepository = answerRepository;
            _fileService = fileService;
        }

        private bool TryGetAverageGrade(IEnumerable<string> grades, out string average)
        {
            var averageGrade = Math.Round(grades.Select(g => double.Parse(g, CultureInfo.InvariantCulture)).Average(), 2);
            var averageString = averageGrade.ToString("0.0", CultureInfo.InvariantCulture);
            if (averageString.EndsWith(".0"))
            {
                average = averageString.Replace(".0", "");
            }
            else if (averageString.EndsWith(".5"))
            {
                average = averageString;
            }
            else
            {
                average = averageGrade.ToString("0.00", CultureInfo.InvariantCulture);
            }
            var regex = new Regex(@"(^2$)|(^3$)|(^3\.5$)|(^4$)|(^4\.5$)|(^5$)");
            if (regex.IsMatch(average))
            {
                return true;
            }
            return false;
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
                Grade = review.Grade,
                Guid = review.Guid,
                QnAs = review.ReviewQnAs.Select(qna => new ReviewQnADTO
                {
                    Question = new QuestionDTO
                    {
                        Id = qna.Question.Id,
                        Text = qna.Question.Text,
                        Order = qna.Question.Order
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
            var thesis = await _thesisRepository.GetAsync(request.ThesisGuid);
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
                return new ConflictObjectResult("Recenzja dla tej pracy została już wystawiona.");
            }

            if (thesis.Reviews.Any(r => r.CreatedBy != currentUser))
            {
                var grade = request.Review.Grade;
                var grades = thesis.Reviews.Where(r => r.CreatedBy != currentUser)
                    .Select(r => r.Grade).ToList();
                grades.Add(grade);

                if (!TryGetAverageGrade(grades, out var average))
                {
                    var contactUser = isPromoter ? "recenzentem" : "promotorem";
                    return new ConflictObjectResult($"Wystawienie recenzji z oceną {grade} nie pozwoli na wyliczenie średniej ocen, " +
                        $"którą można wpisać do systemu USOS (śr. {average}). " +
                        $"Skontaktuj się z {contactUser} pracy i wspólnie ustalcie ocenę końcową, a następnie wprowadźcie oceny pozwalające na wyznaczenie średniej.");
                }

                thesis.Grade = average;
            }

            var questionIds = request.Review.QnAs.Select(qa => qa.Question.Id);
            var questions = _questionRepository.GetAll().Where(q => questionIds.Contains(q.Id)).ToList();
            var activeQuestions = _questionRepository.GetAll().Where(q => q.IsActive).ToList();

            //Not all active questions have been answered
            if (!activeQuestions.Select(q => q.Id).All(questions.Select(q => q.Id).Distinct().Contains) || activeQuestions.Count != questions.Count)
            {
                return new BadRequestObjectResult("Nieprawidłowa lista pytań.");
            }

            var reviewGuid = Guid.NewGuid();
            var review = new Review
            {
                Guid = reviewGuid,
                Thesis = thesis,
                CreatedBy = currentUser,
                Grade = request.Review.Grade,
                ReviewQnAs = new List<ReviewQnA>()
            };

            foreach (var qna in request.Review.QnAs)
            {
                review.ReviewQnAs.Add(new ReviewQnA
                {
                    Review = review,
                    Question = questions.First(q => q.Id == qna.Question.Id),
                    Answer = new Answer
                    {
                        Text = qna.Answer,
                        CreatedBy = currentUser
                    }
                });
            }

            await _reviewRepository.AddAsync(review);

            //Saving change to log
            thesis.LogChange(currentUser, ModificationType.ReviewAdded);
            await _thesisRepository.UpdateAsync(thesis);

            return new CreatedResult("/reviews", reviewGuid);
        }

        [HttpPut("{id:guid}")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> UpdateReview(Guid id, ReviewRequest request)
        {
            var review = await _reviewRepository.GetAsync(id);
            if (review == null)
            {
                return new NotFoundResult();
            }

            var thesis = await _thesisRepository.GetAsync(review.ThesisId);
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

            if (thesis.Reviews.Any(r => r.CreatedBy != currentUser))
            {
                var grade = request.Review.Grade;
                var grades = thesis.Reviews.Where(r => r.CreatedBy != currentUser)
                    .Select(r => r.Grade).ToList();
                grades.Add(grade);

                if (!TryGetAverageGrade(grades, out var average))
                {
                    var contactUser = isPromoter ? "recenzentem" : "promotorem";
                    return new ConflictObjectResult($"Wystawienie recenzji z oceną {grade} nie pozwoli na wyliczenie średniej ocen, " +
                        $"którą można wpisać do systemu USOS (śr. {average}). " +
                        $"Skontaktuj się z {contactUser} pracy i wspólnie ustalcie ocenę końcową, a następnie wprowadźcie oceny pozwalające na wyznaczenie średniej.");
                }

                thesis.Grade = average;
            }

            var questionIds = request.Review.QnAs.Select(qa => qa.Question.Id);
            var questions = _questionRepository.GetAll().Where(q => questionIds.Contains(q.Id)).ToList();
            var activeQuestions = _questionRepository.GetAll().Where(q => q.IsActive).ToList();

            //Not all active questions have been answered
            if (!activeQuestions.Select(q => q.Id).All(questions.Select(q => q.Id).Distinct().Contains) || activeQuestions.Count != questions.Count)
            {
                return new BadRequestObjectResult("Nieprawidłowa lista pytań.");
            }

            review.ModifiedAt = DateTime.Now;
            review.ModifiedBy = currentUser;
            review.Grade = request.Review.Grade;
            //TODO: Generate new file and save it
            //Getting current answers for future removal
            var answersToRemove = review.ReviewQnAs.Select(a => a.Answer).ToList();
            review.ReviewQnAs.Clear();

            foreach (var qna in request.Review.QnAs)
            {
                review.ReviewQnAs.Add(new ReviewQnA
                {
                    Review = review,
                    Question = questions.First(q => q.Id == qna.Question.Id),
                    Answer = new Answer
                    {
                        Text = qna.Answer,
                        CreatedBy = currentUser
                    }
                });
            }

            await _reviewRepository.UpdateAsync(review);
            await _answerRepository.RemoveRangeAsync(answersToRemove);

            //Saving change to log
            thesis.LogChange(currentUser, ModificationType.ReviewChanged);
            await _thesisRepository.UpdateAsync(thesis);

            return new OkObjectResult(review.Guid);
        }
    }
}