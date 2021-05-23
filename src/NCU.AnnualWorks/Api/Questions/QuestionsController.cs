using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Api.Questions.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto.Questions;
using NCU.AnnualWorks.Core.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Questions
{
    [Authorize(AuthorizationPolicies.AtLeastEmployee)]
    public class QuestionsController : ApiControllerBase
    {
        private readonly IAsyncRepository<Question> _questionRepository;
        private readonly IUserRepository _userRepository;
        public QuestionsController(IAsyncRepository<Question> questionRepository, IUserRepository userRepository)
        {
            _questionRepository = questionRepository;
            _userRepository = userRepository;
        }

        [HttpGet]
        public IActionResult GetQuestions()
        {
            var questions = _questionRepository.GetAll()
                .Select(q => new QuestionDTO
                {
                    Id = q.Id,
                    Order = q.Order,
                    Text = q.Text
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
                    Text = q.Text
                }).ToList();

            return new OkObjectResult(questions);
        }

        [HttpPost]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionRequest request)
        {
            var currentUserId = HttpContext.CurrentUserUsosId();
            var user = await _userRepository.GetAsync(currentUserId);
            var question = new Question
            {
                Text = request.Text,
                Order = request.Order,
                IsActive = true,
                CreatedBy = user
            };

            await _questionRepository.AddAsync(question);
            return new OkResult();
        }

        [HttpPut("{id:long}")]
        [Authorize(AuthorizationPolicies.AdminOnly)]
        public async Task<IActionResult> UpdateQuestion(long id, [FromBody] UpdateQuestionRequest request)
        {
            var currentUserId = HttpContext.CurrentUserUsosId();
            var user = await _userRepository.GetAsync(currentUserId);
            var question = await _questionRepository.GetAsync(id);

            if (question == null)
            {
                return new NotFoundResult();
            }

            question.ModifiedBy = user;
            question.ModifiedAt = DateTime.Now;
            question.IsActive = request.IsActive;
            question.Order = request.Order;

            await _questionRepository.UpdateAsync(question);

            return new OkResult();
        }
    }
}
