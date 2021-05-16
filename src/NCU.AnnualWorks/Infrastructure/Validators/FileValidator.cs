using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Core.Options;
using System.IO;
using System.Linq;

namespace NCU.AnnualWorks.Infrastructure.Validators
{
    public class FileValidator : AbstractValidator<IFormFile>
    {
        private readonly ApplicationOptions _options;
        public FileValidator(IOptions<ApplicationOptions> options)
        {
            _options = options.Value;

            RuleFor(p => p.FileName).MaximumLength(255);
            RuleFor(p => Path.GetExtension(p.FileName))
                    .NotEmpty().WithMessage("File extension required.")
                    .MaximumLength(255).WithMessage("File extension too long.");
            if (options.Value.AllowedFileExtensions != null && options.Value.AllowedFileExtensions.Length != 0)
            {
                RuleFor(p => Path.GetExtension(p.FileName))
                   .Must(HaveAllowedExtension)
                   .WithMessage($"File extension not allowed. Allowed file extensions: {string.Join(',', options.Value.AllowedFileExtensions)}");
            }

            if (options.Value.MaxFileSize != 0)
            {
                RuleFor(p => p.Length).LessThanOrEqualTo(options.Value.MaxFileSize);
            }
        }

        private bool HaveAllowedExtension(string extension)
        {
            var parsedExtension = extension.Replace(".", "");
            var allowedExtensions = _options.AllowedFileExtensions.Select(e => e.Replace(".", "")).ToList();

            return allowedExtensions.Contains(parsedExtension);
        }
    }
}
