using AutoMapper;
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
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Data;
using NCU.AnnualWorks.Integrations.Usos.IoC;
using NCU.AnnualWorks.Mappers;
using NCU.AnnualWorks.Repositories;

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
            services.AddControllersWithViews().AddNewtonsoftJson();
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

            //TODO: Figure out a way to move repositories to external assembly
            services.AddTransient<IRepository<Answer>, Repository<Answer>>();
            services.AddTransient<IRepository<File>, Repository<File>>();
            services.AddTransient<IRepository<Keyword>, Repository<Keyword>>();
            services.AddTransient<IRepository<Question>, Repository<Question>>();
            services.AddTransient<IRepository<Review>, Repository<Review>>();
            services.AddTransient<IRepository<Settings>, Repository<Settings>>();
            services.AddTransient<IRepository<Thesis>, Repository<Thesis>>();
            services.AddTransient<IRepository<ThesisLog>, Repository<ThesisLog>>();
            services.AddTransient<IRepository<User>, Repository<User>>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IAntiforgery antiforgery)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
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

            app.Use(next => context =>
            {
                if (context.Request.Path == "/")
                {
                    var tokens = antiforgery.GetAndStoreTokens(context);
                    var cookieOptions = new CookieOptions
                    {
                        HttpOnly = false,
                        Secure = true,
                        SameSite = SameSiteMode.Strict,
                    };
                    context.Response.Cookies.Append(AntiforgeryConsts.FormCookieName, tokens.RequestToken, cookieOptions);
                }
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
