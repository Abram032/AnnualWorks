namespace NCU.AnnualWorks.Core.Models.Dto
{
    public class ThesisActionsDTO
    {
        public bool CanView { get; set; }
        public bool CanPrint { get; set; }
        public bool CanDownload { get; set; }
        public bool CanEdit { get; set; }
        public bool CanAddReview { get; set; }
        public bool CanEditReview { get; set; }
        public bool CanEditGrade { get; set; }
        public bool CanCancelGrade { get; set; }
        public bool CanHide { get; set; }
        public bool CanUnhide { get; set; }
        public bool CanCancelPromoterReview { get; set; }
        public bool CanCancelReviewerReview { get; set; }
        public bool CanAddAdditionalFiles { get; set; }
    }
}
