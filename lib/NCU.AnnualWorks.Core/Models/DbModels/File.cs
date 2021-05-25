using NCU.AnnualWorks.Core.Models.DbModels.Base;
using System;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class File : Entity
    {
        public Guid Guid { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
        public long Size { get; set; }
        public string Extension { get; set; }
        public string ContentType { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public User CreatedBy { get; set; }
        public User ModifiedBy { get; set; }
        public string Checksum { get; set; }

        public Thesis Thesis { get; set; }
        public ICollection<ThesisAdditionalFile> ThesisAdditionalFiles { get; set; }
    }
}
