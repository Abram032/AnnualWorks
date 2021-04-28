using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Options;

namespace NCU.AnnualWorks.Authentication.JWT.IoC
{
    public static class JWTAuthenticationIoC
    {
        public static IServiceCollection AddJWTAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JWTAuthenticationOptions>(options => configuration.GetSection(nameof(JWTAuthenticationOptions)).Bind(options));
            services.AddSingleton<IJWTAuthenticationService, JWTAuthenticationService>();
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = AuthenticationSchemes.JWTAuthenticationScheme;

            }).AddScheme<JWTAuthenticationOptions, JWTAuthenticationHandler>
                (AuthenticationSchemes.JWTAuthenticationScheme, options => { }); //Options and keys loaded from configuration file

            return services;
        }
    }
}
