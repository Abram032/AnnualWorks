using Microsoft.Extensions.DependencyInjection;
using NCU.AnnualWorks.Authentication.Core.Abstractions;

namespace NCU.AnnualWorks.Authentication.IoC
{
    public static class OAuthAuthenticationIoC
    {
        public static IServiceCollection AddOAuthAuthentication(this IServiceCollection services)
        {
            services.AddSingleton<IOAuthTokenService, OAuthTokenService>();

            return services;
        }
    }
}
