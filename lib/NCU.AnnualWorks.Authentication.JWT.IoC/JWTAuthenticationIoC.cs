using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Enums;
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
            services.AddAuthorizationCore(options =>
            {
                //Requires access type of at least Unknown - used during login process or for non-registered users
                options.AddPolicy(AuthorizationPolicies.AtLeastUnknown,
                    policy => policy.RequireClaim(nameof(AccessType),
                    AccessType.Unknown.ToString(),
                    AccessType.Default.ToString(),
                    AccessType.Employee.ToString(),
                    AccessType.Admin.ToString()));
                //Requires access type of at least Default - Read-only access - Students and past users of the system (including employees)
                options.AddPolicy(AuthorizationPolicies.AtLeastDefault,
                    policy => policy.RequireClaim(nameof(AccessType),
                    AccessType.Default.ToString(),
                    AccessType.Employee.ToString(),
                    AccessType.Admin.ToString()));
                //Requires access type of at least Employee - Read-Write access - Promoters and reviewers, lecuterers and coordinators of the course
                options.AddPolicy(AuthorizationPolicies.AtLeastEmployee,
                    policy => policy.RequireClaim(nameof(AccessType),
                    AccessType.Employee.ToString(),
                    AccessType.Admin.ToString()));
                //Requires access type of Admin - Full access - Users specified in database as administrators
                options.AddPolicy(AuthorizationPolicies.AdminOnly,
                    policy => policy.RequireClaim(nameof(AccessType),
                    AccessType.Admin.ToString()));
            });

            return services;
        }
    }
}