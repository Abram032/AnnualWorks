using System;

namespace NCU.AnnualWorks.Core.Models.Dto.Thesis
{
    public class ThesisBasicDTO
    {
        public Guid Guid { get; set; }
        public Guid? ReviewGuid { get; set; }
        public Guid FileGuid { get; set; }
        public string Title { get; set; }
        public ThesisActionsDTO Actions { get; set; }
    }
}
