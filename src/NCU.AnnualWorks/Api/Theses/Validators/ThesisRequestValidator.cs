using FluentValidation;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Api.Theses.Models;
using NCU.AnnualWorks.Core.Options;
using Newtonsoft.Json;

namespace NCU.AnnualWorks.Api.Theses.Validators
{
    public class ThesisRequestValidator : AbstractValidator<ThesisRequest>
    {
        public ThesisRequestValidator(IOptions<ApplicationOptions> options)
        {
            RuleFor(p => p.ThesisFile).NotNull().InjectValidator();
            RuleFor(p => p.Data).NotEmpty().Custom((data, context) =>
            {
                try
                {
                    JsonConvert.DeserializeObject<ThesisRequestData>(data);
                }
                catch
                {
                    context.AddFailure("Failed to deserialize request data.");
                    return;
                }
            });
            RuleFor(p => JsonConvert.DeserializeObject<ThesisRequestData>(p.Data))
                .NotNull().ChildRules(c =>
                {
                    c.RuleFor(p => p.Title).NotEmpty().MaximumLength(1000);
                    c.RuleFor(p => p.Abstract).NotEmpty().MaximumLength(4000);
                    c.RuleFor(p => p.Keywords).NotEmpty()
                        .Must(p => p.Count <= 50)
                        .WithMessage("No more than 50 keywords are allowed.")
                        .ForEach(p => p.InjectValidator());
                    c.RuleFor(p => p.ReviewerUsosId).NotEmpty();
                    c.RuleFor(p => p.AuthorUsosIds).NotEmpty()
                        .Must(p => p.Count <= options.Value.MaxAuthorCount)
                        .WithMessage($"No more than {options.Value.MaxAuthorCount} are allowed.")
                        .ForEach(a => a.NotEmpty());
                });

            RuleForEach(p => p.AdditionalThesisFiles).NotNull().InjectValidator();
        }
    }
}