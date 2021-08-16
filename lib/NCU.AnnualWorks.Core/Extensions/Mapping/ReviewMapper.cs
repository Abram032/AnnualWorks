using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto.Reviews;

namespace NCU.AnnualWorks.Core.Extensions.Mapping
{
    public static class ReviewMapper
    {
        public static ReviewDTO ToBasicDto(this Review review)
        {
            return new ReviewDTO
            {
                Guid = review.Guid,
                Grade = review.IsConfirmed ? review.Grade : null,
                IsConfirmed = review.IsConfirmed
            };
        }
    }
}
