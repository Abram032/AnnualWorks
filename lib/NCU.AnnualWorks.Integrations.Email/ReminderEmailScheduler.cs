using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Integrations.Email.Core;
using NCU.AnnualWorks.Integrations.Email.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Integrations.Email
{
    public class ReminderEmailScheduler : IHostedService, IDisposable
    {
        private readonly ILogger _logger;
        private readonly IServiceProvider _serviceProvider;

        private Timer timer;
        private int[] daysBeforeDeadlineToRemind;

        public ReminderEmailScheduler(ILogger<ReminderEmailScheduler> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;

            daysBeforeDeadlineToRemind = new int[] { 1, 3, 7, 14 };
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            //Runs daily at 12:00
            timer = new Timer(DoWork, null, GetTimeDifferenceToFirstRun(), TimeSpan.FromDays(1));

            _logger.LogInformation("Reminder Email Scheduler started.");
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            timer?.Change(Timeout.Infinite, 0);

            _logger.LogInformation("Reminder Email Scheduler stopped.");
        }

        public void Dispose()
        {
            timer?.Dispose();
        }

        private void DoWork(object state)
        {
            Task.Run(async () =>
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                    var thesisRepository = scope.ServiceProvider.GetRequiredService<IThesisRepository>();
                    var settingsRepository = scope.ServiceProvider.GetRequiredService<IAsyncRepository<Settings>>();

                    var deadline = settingsRepository.GetAll().Single().Deadline;
                    var daysUntilDeadline = GetDaysUntilDeadline(deadline.Value);
                    if (!daysBeforeDeadlineToRemind.Contains(daysUntilDeadline))
                    {
                        _logger.LogInformation($"Days until deadline: {daysUntilDeadline} is not within specified range, skipping run.");
                        return;
                    }

                    var usersToEmail = new List<string>();
                    usersToEmail.AddRange(thesisRepository.GetAll().Select(p => p.Promoter.Email));
                    usersToEmail.AddRange(thesisRepository.GetAll().Select(r => r.Reviewer.Email));
                    usersToEmail = usersToEmail.Where(e => e != null).Distinct().ToList();

                    await emailService.SendEmailReminder(new ReminderEmailModel
                    {
                        Emails = usersToEmail,
                        DaysToDeadline = daysUntilDeadline
                    });
                }
            });
        }

        private int GetDaysUntilDeadline(DateTime deadline)
        {
            return deadline.Subtract(DateTime.Today).Days;
        }

        private TimeSpan GetTimeDifferenceToFirstRun()
        {
            var nextRun = DateTime.Today
                .AddDays(1)
                .AddHours(12)
                .Subtract(DateTime.Now);
            if (nextRun <= TimeSpan.FromDays(1))
            {
                return nextRun;
            }
            return DateTime.Today.AddHours(12).Subtract(DateTime.Now);
        }
    }
}
