namespace NCU.AnnualWorks.Api.Questions.Models
{
    public class CreateQuestionRequest
    {
        public string Text { get; set; }
        public bool IsRequired { get; set; }
        public long Order { get; set; }
    }
}
