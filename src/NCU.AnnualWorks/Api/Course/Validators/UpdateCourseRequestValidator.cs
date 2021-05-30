using FluentValidation;
using NCU.AnnualWorks.Api.Course.Models;

namespace NCU.AnnualWorks.Api.Course.Validators
{
    public class UpdateCourseRequestValidator : AbstractValidator<UpdateCourseRequest>
    {
        public UpdateCourseRequestValidator()
        {
            RuleFor(p => p.CourseCode).NotEmpty().MaximumLength(100);
        }
    }
}
