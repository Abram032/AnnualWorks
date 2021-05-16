using FluentValidation;
using NCU.AnnualWorks.Api.Auth.Models;

namespace NCU.AnnualWorks.Api.Auth.Validators
{
    public class AuthorizeRequestValidator : AbstractValidator<AuthorizeRequest>
    {
        public AuthorizeRequestValidator()
        {
            RuleFor(p => p.OAuthToken).NotEmpty();
            RuleFor(p => p.OAuthVerifier).NotEmpty();
        }
    }
}
