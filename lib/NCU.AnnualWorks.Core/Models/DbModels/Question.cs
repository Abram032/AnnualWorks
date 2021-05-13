using NCU.AnnualWorks.Core.Models.DbModels.Base;
using System;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class Question : Entity
    {
        public long Order { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public User CreatedBy { get; set; }
        public User ModifiedBy { get; set; }
        public bool IsActive { get; set; }

        public ICollection<ReviewQnA> ReviewQnAs { get; set; }
    }
}
