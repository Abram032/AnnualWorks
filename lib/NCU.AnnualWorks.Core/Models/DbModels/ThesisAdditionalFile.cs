namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class ThesisAdditionalFile
    {
        public long ThesisId { get; set; }
        public Thesis Thesis { get; set; }

        public long FileId { get; set; }
        public File File { get; set; }
    }
}
