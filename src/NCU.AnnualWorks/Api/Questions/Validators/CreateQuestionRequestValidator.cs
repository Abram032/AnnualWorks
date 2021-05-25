using FluentValidation;
using NCU.AnnualWorks.Api.Questions.Models;

namespace NCU.AnnualWorks.Api.Questions.Validators
{
    public class CreateQuestionRequestValidator : AbstractValidator<CreateQuestionRequest>
    {
        public CreateQuestionRequestValidator()
        {
            RuleFor(p => p.Text).NotEmpty().MaximumLength(500);
        }
    }
}
