namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class ThesisAuthor
    {
        public long AuthorId { get; set; }
        public User Author { get; set; }

        public long ThesisId { get; set; }
        public Thesis Thesis { get; set; }
    }
}
