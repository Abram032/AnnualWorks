using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;

namespace NCU.AnnualWorks.Integrations.Usos.IoC
{
    public static class UsosClientIoC
    {
        public static IServiceCollection AddUsosClient(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<UsosClientOptions>(options => configuration.GetSection(nameof(UsosClientOptions)).Bind(options));

            services.AddHttpClient<UsosClient>();

            return services;
        }
    }
}
