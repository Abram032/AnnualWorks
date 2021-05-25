using NCU.AnnualWorks.Core.Models.Dto.Questions;

namespace NCU.AnnualWorks.Core.Models.Dto.Reviews
{
    public class ReviewQnADTO
    {
        public QuestionDTO Question { get; set; }
        public string Answer { get; set; }
    }
}
