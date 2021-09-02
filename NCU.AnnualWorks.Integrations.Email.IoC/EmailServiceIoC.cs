using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NCU.AnnualWorks.Integrations.Email.Core;
using NCU.AnnualWorks.Integrations.Email.Core.Options;

namespace NCU.AnnualWorks.Integrations.Email.IoC
{
    public static class EmailServiceIoC
    {
        public static IServiceCollection AddEmailService(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<EmailServiceOptions>(options => configuration.GetSection(nameof(EmailServiceOptions)).Bind(options));
            services.AddScoped<IEmailService, EmailService>();

            return services;
        }
    }
}
