using System;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Api.Reviews.Models
{
    public class ReviewRequest
    {
        public Guid ThesisGuid { get; set; }
        public Dictionary<long, string> QnAs { get; set; }
        public string Grade { get; set; }
        public bool IsConfirmed { get; set; }
    }
}
