using NCU.AnnualWorks.Core.Models.Dto.Questions;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Api.Questions.Models
{
    public class UpdateQuestionsRequest
    {
        public List<QuestionDTO> Questions { get; set; }
    }
}
