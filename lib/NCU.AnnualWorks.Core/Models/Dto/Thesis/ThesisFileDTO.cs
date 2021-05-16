using System;

namespace NCU.AnnualWorks.Core.Models.Dto.Thesis
{
    public class ThesisFileDTO
    {
        public Guid Guid { get; set; }
        public string FileName { get; set; }
        public string Extension { get; set; }
        public string ContentType { get; set; }
        public long Size { get; set; }
        public ThesisFileActionsDTO Actions { get; set; }
    }
}
