using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Options;

namespace NCU.AnnualWorks.Authentication.JWT.IoC
{
    public static class JWTAuthenticationIoC
    {
        public static IServiceCollection AddJWTAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<JWTAuthenticationOptions>(options => configuration.GetSection(nameof(JWTAuthenticationOptions)).Bind(options));
            services.AddSingleton<IJWTAuthenticationService, JWTAuthenticationService>();
            services.AddScoped<IUserContext, UserContext>();
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = AuthenticationSchemes.JWTAuthenticationScheme;

            }).AddScheme<JWTAuthenticationOptions, JWTAuthenticationHandler>
                (AuthenticationSchemes.JWTAuthenticationScheme, options => { }); //Options and keys loaded from configuration file
            services.AddAuthorizationCore(options =>
            {
                //Used during login process or for non-registered users
                options.AddPolicy(AuthorizationPolicies.AuthenticatedOnly, policy =>
                    policy.RequireAssertion(context =>
                        context.User.HasClaim(claim => claim.Type == nameof(AuthClaims.Id) && !string.IsNullOrEmpty(claim.Value))));
                //Current participants of the course, lecturers, administrators and custom added users
                options.AddPolicy(AuthorizationPolicies.AtLeastStudent,
                    policy => policy.RequireAssertion(context =>
                        context.User.HasClaim(claim => claim.Type == nameof(AuthClaims.IsParticipant) && bool.Parse(claim.Value)) ||
                        context.User.HasClaim(claim => claim.Type == nameof(AuthClaims.IsLecturer) && bool.Parse(claim.Value)) ||
                        context.User.HasClaim(claim => claim.Type == nameof(AuthClaims.IsCustom) && bool.Parse(claim.Value)) ||
                        context.User.HasClaim(claim => claim.Type == nameof(AuthClaims.IsAdmin) && bool.Parse(claim.Value))));
                //Current lecturers, administrators and custom added users
                options.AddPolicy(AuthorizationPolicies.AtLeastEmployee,
                    policy => policy.RequireAssertion(context =>
                        context.User.HasClaim(claim => claim.Type == nameof(AuthClaims.IsLecturer) && bool.Parse(claim.Value)) ||
                        context.User.HasClaim(claim => claim.Type == nameof(AuthClaims.IsCustom) && bool.Parse(claim.Value)) ||
                        context.User.HasClaim(claim => claim.Type == nameof(AuthClaims.IsAdmin) && bool.Parse(claim.Value))));
                //Current lecturers only - used during creation process of thesis
                options.AddPolicy(AuthorizationPolicies.LecturersOnly, policy => policy.RequireClaim(nameof(AuthClaims.IsLecturer), true.ToString()));
                //Full access - Users specified in database as administrators or default system administrator specified in configuration file
                options.AddPolicy(AuthorizationPolicies.AdminOnly, policy => policy.RequireClaim(nameof(AuthClaims.IsAdmin), true.ToString()));
            });

            return services;
        }
    }
}