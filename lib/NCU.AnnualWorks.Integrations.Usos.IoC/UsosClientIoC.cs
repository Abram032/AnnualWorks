using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NCU.AnnualWorks.Integrations.Usos.Core;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;

namespace NCU.AnnualWorks.Integrations.Usos.IoC
{
    public static class UsosServiceIoC
    {
        public static IServiceCollection AddUsosService(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<UsosServiceOptions>(options => configuration.GetSection(nameof(UsosServiceOptions)).Bind(options));

            services.AddHttpClient<IUsosService, UsosService>();

            return services;
        }
    }
}
