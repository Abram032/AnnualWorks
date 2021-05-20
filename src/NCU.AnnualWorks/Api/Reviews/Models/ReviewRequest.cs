using NCU.AnnualWorks.Core.Models.Dto.Reviews;
using System;

namespace NCU.AnnualWorks.Api.Reviews.Models
{
    public class ReviewRequest
    {
        public Guid ThesisGuid { get; set; }
        public ReviewDTO Review { get; set; }
    }
}
