using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NCU.AnnualWorks.Authentication.Core.Constants;
using NCU.AnnualWorks.Authentication.Core.Options;

namespace NCU.AnnualWorks.Authentication.IoC
{
    public static class JWTAuthenticationIoC
    {
        public static IServiceCollection AddJWTAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JWTAuthenticationOptions>(options => configuration.GetSection(nameof(JWTAuthenticationOptions)).Bind(options));

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = AuthenticationSchemes.JWTAuthenticationScheme;

            }).AddScheme<JWTAuthenticationOptions, JWTAuthenticationHandler>
                (AuthenticationSchemes.JWTAuthenticationScheme, options => { });

            return services;
        }
    }
}
