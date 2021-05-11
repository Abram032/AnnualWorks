using System.Collections.Generic;

namespace NCU.AnnualWorks.Core.Models.Dto.Terms
{
    public class TermDTO
    {
        public string Id { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string FinishDate { get; set; }
        public Dictionary<string, string> Names { get; set; }
    }
}
