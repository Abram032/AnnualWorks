using NCU.AnnualWorks.Core.Models.DbModels.Base;
using System;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class Keyword : Entity
    {
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public User CreatedBy { get; set; }
        public User ModifiedBy { get; set; }

        public ICollection<ThesisKeyword> ThesisKeywords { get; set; }
    }
}
