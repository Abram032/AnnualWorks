using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Api.Questions.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto.Questions;
using NCU.AnnualWorks.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Questions
{
    [Authorize(AuthorizationPolicies.AtLeastEmployee)]
    public class QuestionsController : ApiControllerBase
    {
        private readonly IAsyncRepository<Question> _questionRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserContext _userContext;
        public QuestionsController(IAsyncRepository<Question> questionRepository, IUserRepository userRepository, IUserContext userContext)
        {
            _questionRepository = questionRepository;
            _userRepository = userRepository;
            _userContext = userContext;
        }

        [HttpGet]
        public IActionResult GetQuestions()
        {
            var questions = _questionRepository.GetAll()
                .OrderBy(q => q.Order)
                .Select(q => new QuestionDTO
                {
                    Id = q.Id,
                    Order = q.Order,
                    Text = q.Text,
                    IsActive = q.IsActive,
                    IsRequired = q.IsRequired,
                }).ToList();

            return new OkObjectResult(questions);
        }

        [HttpGet("active")]
        public IActionResult GetActiveQuestions()
        {
            var questions = _questionRepository.GetAll()
                .Where(q => q.IsActive)
                .OrderBy(q => q.Order)
                .Select(q => new QuestionDTO
                {
                    Id = q.Id,
                    Order = q.Order,
                    Text = q.Text,
                    IsActive = q.IsActive,
                    IsRequired = q.IsRequired,
                }).ToList();

            return new OkObjectResult(questions);
        }

        [HttpPut]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> UpdateQuestion([FromBody] UpdateQuestionsRequest request)
        {
            var user = await _userRepository.GetAsync(_userContext.CurrentUser.Id);
            var dbQuestions = _questionRepository.GetAll().ToList();

            var updatedQuestions = new List<Question>();
            var addedQuestions = new List<Question>();
            foreach (var question in request.Questions)
            {
                var dbQuestion = dbQuestions.FirstOrDefault(q => q.Id == question.Id);
                if (dbQuestion != null)
                {
                    dbQuestion.Text = question.Text;
                    dbQuestion.IsActive = question.IsActive;
                    dbQuestion.IsRequired = question.IsRequired;
                    dbQuestion.Order = question.Order;
                    dbQuestion.ModifiedAt = DateTime.Now;
                    dbQuestion.ModifiedBy = user;
                    updatedQuestions.Add(dbQuestion);
                }
                else
                {
                    addedQuestions.Add(new Question
                    {
                        Text = question.Text,
                        IsActive = question.IsActive,
                        IsRequired = question.IsRequired,
                        Order = question.Order,
                        CreatedAt = DateTime.Now,
                        CreatedBy = user
                    });
                }
            }

            await _questionRepository.UpdateRangeAsync(updatedQuestions);
            await _questionRepository.AddRangeAsync(addedQuestions);

            return new OkResult();
        }
    }
}
