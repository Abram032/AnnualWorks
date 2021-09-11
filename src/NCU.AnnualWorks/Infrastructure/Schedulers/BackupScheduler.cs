using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Core.Options;
using NCU.AnnualWorks.Core.Services;
using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Threading;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Infrastructure.Schedulers
{
    public class BackupScheduler : IHostedService, IDisposable
    {
        private readonly ILogger _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly BackupSchedulerOptions _options;

        private Timer timer;

        public BackupScheduler(ILogger<BackupScheduler> logger, IOptions<BackupSchedulerOptions> options, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _options = options.Value;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            //Sets next run to 5 minutes after deadline has passed or to next day
            var nextRun = await GetTimeToNextRunAsync();
            timer = new Timer(DoWork, null, nextRun, TimeSpan.FromDays(1));

            _logger.LogInformation("Backup Scheduler started.");
            _logger.LogInformation($"Next run of backup scheduler in {nextRun.TotalHours} hours.");
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            timer?.Change(Timeout.Infinite, 0);

            _logger.LogInformation("Backup Scheduler stopped.");
        }

        public void Dispose()
        {
            timer?.Dispose();
        }

        private void DoWork(object state)
        {
            Task.Run(async () =>
            {
                _logger.LogInformation("Starting backup job.");

                var deadline = await GetDeadlineAsync();
                var nextRun = await GetTimeToNextRunAsync();

                if (deadline.HasValue && deadline.Value < DateTime.Now && GetDifferenceBetweenDates(deadline.Value, DateTime.Now) < TimeSpan.FromDays(1))
                {
                    await BackupData();
                }
                timer?.Change(nextRun, TimeSpan.FromDays(1));

                _logger.LogInformation($"Next run of backup scheduler in {nextRun.TotalHours} hours.");
            });
        }

        private async Task BackupData()
        {
            try
            {
                //Creating backup directories if they don't exist
                var basePath = Directory.GetCurrentDirectory();
                var filesPath = Path.Combine(basePath, "files");

                var backupsPath = Path.Combine(basePath, "backups");
                var tempBackupPath = Path.Combine(backupsPath, "_temp");
                var currentBackupName = $"backup-{DateTime.Now.ToString("dd-MM-yyyy_HH-mm-ss")}";
                var currentBackupPath = Path.Combine(tempBackupPath, currentBackupName);

                Directory.CreateDirectory(backupsPath);
                Directory.CreateDirectory(tempBackupPath);
                Directory.CreateDirectory(currentBackupPath);

                await BackupDatabase(_options.Username, _options.Passowrd, _options.Database, currentBackupPath);
                BackupFiles(filesPath, currentBackupPath);
                ArchiveBackup(currentBackupPath, backupsPath, currentBackupName);

                Directory.Delete(tempBackupPath, true);

                _logger.LogInformation("Backup completed");
            }
            catch (Exception e)
            {
                _logger.LogError($"Failed to backup data. Reason: {e.Message}");
            }
        }

        private async Task BackupDatabase(string user, string password, string database, string backupPath)
        {
            _logger.LogInformation("Performing database backup");

            try
            {
                var dumpFile = Path.Combine(backupPath, "dump.sql");
                var processInfo = new ProcessStartInfo
                {
                    FileName = _options.MysqlDumpPath,
                    Arguments = $"-u {user} -p{password} {database}",
                    UseShellExecute = false,
                    CreateNoWindow = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };
                var process = Process.Start(processInfo);

                var data = await process.StandardOutput.ReadToEndAsync();
                await File.WriteAllTextAsync(dumpFile, data);

                process.Close();
            }
            catch (Exception e)
            {
                _logger.LogError($"Failed to perform database backup. Reason: {e.Message}");
            }
        }

        private void BackupFiles(string pathToFiles, string backupPath)
        {
            _logger.LogInformation("Performing files backup");

            try
            {
                ZipFile.CreateFromDirectory(pathToFiles, Path.Combine(backupPath, "files.zip"));
            }
            catch (Exception e)
            {
                _logger.LogError($"Failed to perform files backup. Reason: {e.Message}");
            }
        }

        private void ArchiveBackup(string pathToCurrentBackup, string pathToBackups, string currentBackupName)
        {
            _logger.LogInformation("Archiving backup package");

            try
            {
                ZipFile.CreateFromDirectory(pathToCurrentBackup, Path.Combine(pathToBackups, pathToBackups, $"{currentBackupName}.zip"));
            }
            catch (Exception e)
            {
                _logger.LogError($"Failed to archive backup package. Reason: {e.Message}");
            }
        }

        private TimeSpan GetDifferenceBetweenDates(DateTime a, DateTime b)
        {
            return b > a ? b.Subtract(a) : a.Subtract(b);
        }

        private async Task<DateTime?> GetDeadlineAsync()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var settingsService = scope.ServiceProvider.GetRequiredService<ISettingsService>();
                var deadline = await settingsService.GetDeadline();
                return deadline;
            }
        }

        private async Task<TimeSpan> GetTimeToNextRunAsync()
        {
            var nextRun = TimeSpan.FromDays(1);
            var deadline = await GetDeadlineAsync();

            if (deadline.HasValue && deadline > DateTime.Now)
            {
                nextRun = deadline.Value
                    .Subtract(DateTime.Now)
                    .Add(TimeSpan.FromMinutes(5));
            }
            return nextRun;
        }
    }
}
