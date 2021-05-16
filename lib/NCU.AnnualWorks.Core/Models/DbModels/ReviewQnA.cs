namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class ReviewQnA
    {
        public long ReviewId { get; set; }
        public Review Review { get; set; }
        public long QuestionId { get; set; }
        public Question Question { get; set; }
        public long AnswerId { get; set; }
        public Answer Answer { get; set; }
    }
}
