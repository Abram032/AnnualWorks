using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Options;
using NCU.AnnualWorks.Infrastructure.Data;
using NCU.AnnualWorks.Integrations.Usos.Core.Options;
using System;
using System.IO;
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
                .ConfigureLogging((hostingContext, logging) =>
                {
                    var env = hostingContext.HostingEnvironment;
                    logging.ClearProviders();
                    logging.AddConsole();
                    if (env.IsDevelopment())
                    {
                        logging.AddFile(Path.Combine(Environment.CurrentDirectory, "logs/log-{Date}.log"), fileSizeLimitBytes: 10000000, retainedFileCountLimit: 128);
                    }
                    else
                    {
                        logging.AddFile("/app/logs/log-{Date}.log", fileSizeLimitBytes: 10000000, retainedFileCountLimit: 128);
                    }
                })
                //.ConfigureAppConfiguration((hostingContext, config) =>
                //{
                //    var env = hostingContext.HostingEnvironment;
                //    if (!env.IsDevelopment())
                //    {
                //        config.AddJsonFile("/run/secrets/secrets.json", optional: false);
                //    }
                //})
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
                if (await apiContext.Settings.AnyAsync() == false)
                {
                    await apiContext.Settings.AddAsync(new Settings
                    {
                        CourseCode = usosOptions.CourseCode
                    });
                    await apiContext.SaveChangesAsync();
                }

                if (await apiContext.Questions.AnyAsync() == false)
                {
                    await apiContext.Questions.AddRangeAsync(
                        new Question { Id = 1, Order = 1, CreatedAt = DateTime.Now, IsActive = true, IsRequired = true, Text = "Czy treść pracy odpowiada tematowi określonemu w tytule?" },
                        new Question { Id = 2, Order = 2, CreatedAt = DateTime.Now, IsActive = true, IsRequired = true, Text = "Ocena układu pracy, podziału treści, kolejności rozdziałów, kompletności tez itp." },
                        new Question { Id = 3, Order = 3, CreatedAt = DateTime.Now, IsActive = true, IsRequired = true, Text = "Merytoryczna ocena" },
                        new Question { Id = 4, Order = 4, CreatedAt = DateTime.Now, IsActive = true, IsRequired = true, Text = "Czy i w jakim zakresie praca stanowi nowe ujęcie" },
                        new Question { Id = 5, Order = 5, CreatedAt = DateTime.Now, IsActive = true, IsRequired = true, Text = "Charakterystyka doboru i wykorzystania źródeł" },
                        new Question { Id = 6, Order = 6, CreatedAt = DateTime.Now, IsActive = true, IsRequired = true, Text = "Ocena formalnej strony pracy (poprawność języka, opanowanie techniki pisania pracy, spis rzeczy, odsyłacze)" },
                        new Question { Id = 7, Order = 7, CreatedAt = DateTime.Now, IsActive = true, IsRequired = true, Text = "Sposób wykorzystania pracy (publikacja, udostpęnienie instytucjom, materiał źródłowy)" },
                        new Question { Id = 8, Order = 8, CreatedAt = DateTime.Now, IsActive = true, IsRequired = false, Text = "Inne uwagi" });
                    await apiContext.SaveChangesAsync();
                }
            }
        }
    }
}
