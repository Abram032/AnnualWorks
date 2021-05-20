using FluentValidation;
using NCU.AnnualWorks.Api.Reviews.Models;
using System.Text.RegularExpressions;

namespace NCU.AnnualWorks.Api.Reviews.Validators
{
    public class ReviewRequestValidator : AbstractValidator<ReviewRequest>
    {
        public ReviewRequestValidator()
        {
            RuleFor(cp => cp.ThesisGuid).NotEmpty();
            RuleFor(r => r.Review).ChildRules(p =>
            {
                p.RuleFor(cp => cp.Grade).NotEmpty().Matches(new Regex(@"(^2$)|(^3$)|(^3\.5$)|(^4$)|(^4\.5$)|(^5$)"));
                p.RuleForEach(cp => cp.QnAs)
                    .ChildRules(qa =>
                    {
                        qa.RuleFor(caq => caq.Answer).NotEmpty().MaximumLength(2000);
                        qa.RuleFor(caq => caq.Question).NotEmpty().ChildRules(q => q.RuleFor(cq => cq.Id).NotEmpty());
                    });
            });
        }
    }
}
