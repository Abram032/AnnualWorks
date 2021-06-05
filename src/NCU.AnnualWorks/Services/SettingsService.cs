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

        public async Task<DateTime> GetDeadline(OAuthRequest oauthRequest)
        {
            var deadline = _settingsRepository.GetAll().Single().Deadline;
            var term = await _usosService.GetCurrentTerm(oauthRequest);
            var termEndDate = DateTime.Parse(term.EndDate);
            var termStartDate = DateTime.Parse(term.StartDate);

            if (deadline.HasValue && deadline > termStartDate && deadline < termEndDate)
            {
                return deadline.Value.Date;
            }
            else
            {
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
