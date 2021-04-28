using Microsoft.Extensions.DependencyInjection;
using NCU.AnnualWorks.Authentication.OAuth.Core;

namespace NCU.AnnualWorks.Authentication.OAuth.IoC
{
    public static class OAuthAuthenticationIoC
    {
        public static IServiceCollection AddOAuthAuthentication(this IServiceCollection services)
        {
            services.AddSingleton<IOAuthService, OAuthService>();

            return services;
        }
    }
}
