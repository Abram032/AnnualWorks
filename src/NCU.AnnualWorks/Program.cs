using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Options;
using NCU.AnnualWorks.Infrastructure.Data;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            await MigrateDatabase(host);
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    var env = hostingContext.HostingEnvironment;
                    if (!env.IsDevelopment())
                    {
                        config.AddJsonFile("/run/secrets/secrets.json", optional: false);
                    }
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        public static async Task MigrateDatabase(IHost host)
        {
            using (var scope = host.Services.GetService<IServiceScopeFactory>().CreateScope())
            {
                //Database migration
                var apiContext = scope.ServiceProvider.GetRequiredService<ApiDbContext>();

                if (await apiContext.Database.GetService<IRelationalDatabaseCreator>().ExistsAsync() == false)
                {
                    await apiContext.Database.MigrateAsync();
                }
                else
                {
                    var migrations = await apiContext.Database.GetPendingMigrationsAsync();
                    if (migrations.Count() > 0)
                    {
                        await apiContext.Database.MigrateAsync();
                    }
                }

                //Seeding
                var appOptions = scope.ServiceProvider.GetRequiredService<IOptions<ApplicationOptions>>().Value;
                var usosOptions = scope.ServiceProvider.GetRequiredService<IOptions<UsosServiceOptions>>().Value;
                var currentSettings = await apiContext.Settings.FirstOrDefaultAsync();
                if (currentSettings == null)
                {
                    await apiContext.Settings.AddAsync(new Settings
                    {
                        CourseCode = usosOptions.CourseCode,
                        CourseUrl = usosOptions.CourseUrl,
                    });
                    await apiContext.SaveChangesAsync();
                }
            }
        }
    }
}
