using NCU.AnnualWorks.Core.Models.DbModels.Base;
using System;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class Review : Entity
    {
        public Guid Guid { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public User CreatedBy { get; set; }
        public User ModifiedBy { get; set; }
        public string Grade { get; set; }

        public long FileId { get; set; }
        public File File { get; set; }
        public Thesis Thesis { get; set; }
        public ICollection<ReviewQnA> ReviewQnAs { get; set; }
    }
}
