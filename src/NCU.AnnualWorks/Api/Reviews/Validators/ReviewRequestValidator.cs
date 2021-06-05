using FluentValidation;
using NCU.AnnualWorks.Api.Reviews.Models;
using System.Text.RegularExpressions;

namespace NCU.AnnualWorks.Api.Reviews.Validators
{
    public class ReviewRequestValidator : AbstractValidator<ReviewRequest>
    {
        public ReviewRequestValidator()
        {
            RuleFor(p => p.ThesisGuid).NotEmpty();
            RuleFor(p => p.QnAs).NotEmpty();
            RuleForEach(p => p.QnAs.Keys).NotEmpty();
            RuleForEach(p => p.QnAs.Values).MaximumLength(2500);
            RuleFor(p => p).Must(HaveGradeIfConfirmed).WithMessage("Ocena jest wymagana");
            //RuleFor(p => p.Grade).NotEmpty().Matches(new Regex(@"(^2$)|(^3$)|(^3\.5$)|(^4$)|(^4\.5$)|(^5$)"));
        }

        private bool HaveGradeIfConfirmed(ReviewRequest review)
        {
            if (review.IsConfirmed)
            {
                var regex = new Regex(@"(^2$)|(^3$)|(^3\.5$)|(^4$)|(^4\.5$)|(^5$)");
                return regex.IsMatch(review.Grade);
            }

            return true;
        }
    }
}
