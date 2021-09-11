using NCU.AnnualWorks.Authentication.OAuth.Core.Models;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using NCU.AnnualWorks.Integrations.Usos.Core;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly IAsyncRepository<Settings> _settingsRepository;
        private readonly IUsosService _usosService;
        public SettingsService(IAsyncRepository<Settings> settingsRepository, IUsosService usosService)
        {
            _settingsRepository = settingsRepository;
            _usosService = usosService;
        }

        public async Task<DateTime?> GetDeadline()
        {
            var settings = _settingsRepository.GetAll().Single();
            return settings.Deadline;
        }

        public async Task<DateTime> GetDeadline(OAuthRequest oauthRequest)
        {
            var settings = _settingsRepository.GetAll().Single();
            var term = await _usosService.GetCurrentTerm(oauthRequest);
            var termEndDate = DateTime.Parse(term.EndDate);
            var termStartDate = DateTime.Parse(term.StartDate);

            if (settings.Deadline.HasValue && settings.Deadline > termStartDate && settings.Deadline < termEndDate)
            {
                return settings.Deadline.Value.Date;
            }
            else
            {
                //Current deadline is not within term, set a new one
                settings.Deadline = termEndDate;
                await _settingsRepository.UpdateAsync(settings);
                return termEndDate;
            }
        }

        public async Task<bool> SetDeadline(OAuthRequest oauthRequest, DateTime deadline)
        {
            var settings = _settingsRepository.GetAll().Single();
            var term = await _usosService.GetCurrentTerm(oauthRequest);
            var termEndDate = DateTime.Parse(term.EndDate);
            var termStartDate = DateTime.Parse(term.StartDate);

            if (deadline > termStartDate && deadline < termEndDate)
            {
                settings.Deadline = deadline.Date;
                await _settingsRepository.UpdateAsync(settings);
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
