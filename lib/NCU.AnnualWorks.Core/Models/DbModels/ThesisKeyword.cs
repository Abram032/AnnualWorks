namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class ThesisKeyword
    {
        public long KeywordId { get; set; }
        public Keyword Keyword { get; set; }

        public long ThesisId { get; set; }
        public Thesis Thesis { get; set; }
    }
}
