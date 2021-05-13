using NCU.AnnualWorks.Core.Models.DbModels.Base;
using System;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class Thesis : Entity
    {
        public Guid Guid { get; set; }
        public string Title { get; set; }
        public string Abstract { get; set; }
        public long FileId { get; set; }
        public File File { get; set; }
        public User Promoter { get; set; }
        public User Reviewer { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public User CreatedBy { get; set; }
        public User ModifiedBy { get; set; }
        public string TermId { get; set; }
        public bool Hidden { get; set; }
        public string Grade { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public ICollection<ThesisKeyword> ThesisKeywords { get; set; }
        public ICollection<ThesisAuthor> ThesisAuthors { get; set; }
        public ICollection<ThesisLog> ThesisLogs { get; set; }
        public ICollection<ThesisAdditionalFile> ThesisAdditionalFiles { get; set; }
    }
}
