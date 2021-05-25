namespace NCU.AnnualWorks.Api.Questions.Models
{
    public class UpdateQuestionRequest
    {
        public long Order { get; set; }
        public bool IsRequired { get; set; }
        public bool IsActive { get; set; }
    }
}
