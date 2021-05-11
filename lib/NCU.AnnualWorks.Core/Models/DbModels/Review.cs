using System;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class Review
    {
        public long Id { get; set; }
        public Guid Guid { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public User CreatedBy { get; set; }
        public User ModifiedBy { get; set; }
        public string Grade { get; set; }

        public long FileId { get; set; }
        public File File { get; set; }
        public Thesis Thesis { get; set; }
        public ICollection<ReviewQnA> ReviewQnAs { get; set; }

        //public File RawFile { get; set; }
        //public File GeneratedFile { get; set; }
    }
}
