namespace NCU.AnnualWorks.Core.Models.Dto.Questions
{
    public class QuestionDTO
    {
        public long Id { get; set; }
        public string Text { get; set; }
        public long Order { get; set; }
        public bool IsActive { get; set; }
        public bool IsRequired { get; set; }
    }
}
