using System;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Core.Models.Dto.Reviews
{
    public class ReviewDTO
    {
        public Guid Guid { get; set; }
        public List<ReviewQnADTO> QnAs { get; set; }
        public string Grade { get; set; }
        public bool IsConfirmed { get; set; }
    }
}
