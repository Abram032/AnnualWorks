﻿namespace NCU.AnnualWorks.Core.Models.Dto
{
    public class ThesisActionsDTO
    {
        public bool CanView { get; set; }
        public bool CanPrint { get; set; }
        public bool CanDownload { get; set; }
        public bool CanEdit { get; set; }
        public bool CanAddReview { get; set; }
        public bool CanEditReview { get; set; }
    }
}