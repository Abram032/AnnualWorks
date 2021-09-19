using FluentValidation;
using NCU.AnnualWorks.Api.Questions.Models;

namespace NCU.AnnualWorks.Api.Questions.Validators
{
    public class UpdateQuestionRequestValidator : AbstractValidator<UpdateQuestionsRequest>
    {
        public UpdateQuestionRequestValidator()
        {
            RuleForEach(p => p.Questions).ChildRules(c =>
            {
                c.RuleFor(q => q.Text).NotEmpty().MaximumLength(500);
            });
        }
    }
}
