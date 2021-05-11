using System;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Core.Models.Dto
{
    public class ThesisDTO
    {
        public Guid Guid { get; set; }
        public string Title { get; set; }
        public string Abstract { get; set; }
        public string PromoterId { get; set; }
        public string ReviewerId { get; set; }
        public List<string> AuthorsIds { get; set; }
        public List<string> Keywords { get; set; }
        public ThesisActionsDTO Actions { get; set; }
    }
}
