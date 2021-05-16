using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NCU.AnnualWorks.Authentication.JWT.IoC;
using NCU.AnnualWorks.Authentication.OAuth.IoC;
using NCU.AnnualWorks.Constants;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Options;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using NCU.AnnualWorks.Infrastructure.Data;
using NCU.AnnualWorks.Infrastructure.Data.Repositories;
using NCU.AnnualWorks.Integrations.Usos.IoC;
using NCU.AnnualWorks.Mappers;
using NCU.AnnualWorks.Services;

namespace NCU.AnnualWorks
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<ApplicationOptions>(options => Configuration.GetSection(nameof(ApplicationOptions)).Bind(options));

            services.AddControllersWithViews()
                .AddNewtonsoftJson()
                .AddFluentValidation(options =>
                {
                    options.RegisterValidatorsFromAssemblyContaining<Startup>();
                    options.RunDefaultMvcValidationAfterFluentValidationExecutes = false;
                    options.ValidatorOptions.DisplayNameResolver = (type, member, lambda) =>
                    {
                        if (member != null)
                        {
                            return member.Name;
                        }
                        return null;
                    };
                    options.ValidatorOptions.CascadeMode = CascadeMode.Stop;
                });
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddMemoryCache();

            services.AddJWTAuthentication(Configuration);
            services.AddOAuthAuthentication();
            services.AddAntiforgery(options =>
            {
                options.FormFieldName = AntiforgeryConsts.FormFieldName;
                options.HeaderName = AntiforgeryConsts.HeaderName;
                options.Cookie.Name = AntiforgeryConsts.CookieName;
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.Strict;
            });

            services.AddUsosService(Configuration);

            //TODO: Move mapper to Core
            var mapperConfiguration = new MapperConfiguration(config =>
            {
                config.AddProfile(new MappingProfile());
            });
            var mapper = mapperConfiguration.CreateMapper();
            services.AddSingleton(mapper);

            services.AddDbContext<ApiDbContext>(options =>
            {
                //TODO: Use options instead of IConfiguration
                options.UseMySql(Configuration["DB_CONNECTION_STRING"]);
            });

            services.AddSingleton<IFileService, FileService>();

            //TODO: Figure out a way to move repositories to external assembly
            services.AddTransient<IAsyncRepository<Answer>, AsyncRepository<Answer>>();
            services.AddTransient<IAsyncRepository<File>, AsyncRepository<File>>();
            services.AddTransient<IAsyncRepository<Keyword>, AsyncRepository<Keyword>>();
            services.AddTransient<IAsyncRepository<Question>, AsyncRepository<Question>>();
            services.AddTransient<IAsyncRepository<Review>, AsyncRepository<Review>>();
            services.AddTransient<IAsyncRepository<Settings>, AsyncRepository<Settings>>();
            services.AddTransient<IAsyncRepository<Thesis>, AsyncRepository<Thesis>>();
            services.AddTransient<IAsyncRepository<ThesisLog>, AsyncRepository<ThesisLog>>();
            services.AddTransient<IAsyncRepository<User>, AsyncRepository<User>>();

            services.AddTransient<IThesisRepository, ThesisRepository>();
            services.AddTransient<IUserRepository, UserRepository>();

            services.AddSwaggerGen();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IAntiforgery antiforgery)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                });
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseStaticFiles(new StaticFileOptions
            {
                //TODO: Test if this works and reduces cache time
                OnPrepareResponse = context =>
                {
                    context.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
                    context.Context.Response.Headers.Add("Expires", "-1");
                }
            });
            app.UseSpaStaticFiles();
            //app.UseStaticFiles(new StaticFileOptions
            //{
            //    FileProvider = new PhysicalFileProvider(
            //        Path.Combine(Directory.GetCurrentDirectory(), "files")),
            //    RequestPath = "/files",
            //});

            app.Use(next => context =>
            {
                var tokens = antiforgery.GetAndStoreTokens(context);
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                };
                context.Response.Cookies.Append(AntiforgeryConsts.FormCookieName, tokens.RequestToken, cookieOptions);
                return next(context);
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
