using FluentValidation;
using NCU.AnnualWorks.Core.Models.Dto.Keywords;

namespace NCU.AnnualWorks.Infrastructure.Validators
{
    public class KeywordValidator : AbstractValidator<KeywordDTO>
    {
        public KeywordValidator()
        {
            RuleFor(p => p.Text).NotEmpty().MaximumLength(255);
        }
    }
}
