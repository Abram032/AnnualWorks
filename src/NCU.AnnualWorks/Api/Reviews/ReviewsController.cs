﻿using Microsoft.AspNetCore.Authorization;
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
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Reviews
{
    [Authorize(AuthorizationPolicies.AtLeastEmployee)]
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

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetReview(Guid id)
        {
            var review = _reviewRepository.GetAll()
                .Select(r => new ReviewDTO
                {
                    Grade = r.Grade,
                    Guid = r.Guid,
                    QnAs = r.ReviewQnAs.Select(qna => new ReviewQnADTO
                    {
                        Question = new QuestionDTO
                        {
                            Id = qna.Question.Id,
                            Text = qna.Question.Text,
                            Order = qna.Question.Order
                        },
                        Answer = qna.Answer.Text
                    }).ToList()
                })
                .FirstOrDefault(r => r.Guid == id);

            if (review == null)
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(review);
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] ReviewRequest request)
        {
            var thesis = await _thesisRepository.GetAsync(request.ThesisGuid);
            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());

            if (thesis == null)
            {
                return new NotFoundResult();
            }

            //Current user is nor promoter neither reviewer
            if (thesis.Promoter != currentUser && thesis.Reviewer != currentUser)
            {
                return new ForbidResult();
            }

            if (thesis.Reviews.Any(r => r.CreatedBy == currentUser))
            {
                return new ConflictObjectResult("Recenzja dla tej pracy została już wystawiona.");
            }

            var questionIds = request.Review.QnAs.Select(qa => qa.Question.Id);
            var questions = _questionRepository.GetAll().Where(q => questionIds.Contains(q.Id)).ToList();
            var activeQuestions = _questionRepository.GetAll().Where(q => q.IsActive).ToList();

            //Not all active questions have been answered
            if (!activeQuestions.Select(q => q.Id).All(questions.Select(q => q.Id).Distinct().Contains) || activeQuestions.Count != questions.Count)
            {
                return new BadRequestObjectResult(new { errorMessage = "Nieprawidłowa lista pytań." });
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

            //Saving change to log
            await _thesisLogRepository.AddAsync(new ThesisLog
            {
                Thesis = thesis,
                Timestamp = DateTime.Now,
                User = currentUser,
                ModificationType = ModificationType.ReviewAdded
            });
            await _reviewRepository.AddAsync(review);

            return new CreatedResult("/reviews", reviewGuid);
        }

        [HttpPut("{id:guid}")]
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

            //Current user is nor promoter neither reviewer
            if (thesis.Promoter != currentUser && thesis.Reviewer != currentUser)
            {
                return new ForbidResult();
            }

            var questionIds = request.Review.QnAs.Select(qa => qa.Question.Id);
            var questions = _questionRepository.GetAll().Where(q => questionIds.Contains(q.Id)).ToList();
            var activeQuestions = _questionRepository.GetAll().Where(q => q.IsActive).ToList();

            //Not all active questions have been answered
            if (!activeQuestions.Select(q => q.Id).All(questions.Select(q => q.Id).Distinct().Contains) || activeQuestions.Count != questions.Count)
            {
                return new BadRequestObjectResult(new { errorMessage = "Nieprawidłowa lista pytań." });
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

            //Saving change to log
            await _thesisLogRepository.AddAsync(new ThesisLog
            {
                Thesis = thesis,
                Timestamp = DateTime.Now,
                User = currentUser,
                ModificationType = ModificationType.ReviewChanged
            });
            await _reviewRepository.UpdateAsync(review);
            await _answerRepository.RemoveRangeAsync(answersToRemove);

            return new OkObjectResult(review.Guid);
        }
    }
}