using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Integrations.Usos.Core;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Export
{
    [Authorize(AuthorizationPolicies.AdminOnly)]
    public class ExportController : ApiControllerBase
    {
        private readonly IThesisRepository _thesisRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUsosService _usosService;
        public ExportController(IThesisRepository thesisRepository, IUserRepository userRepository,
            IUsosService usosService)
        {
            _thesisRepository = thesisRepository;
            _userRepository = userRepository;
            _usosService = usosService;
        }

        [HttpGet("state")]
        public async Task<IActionResult> GetState([FromQuery] string termId)
        {
            if (string.IsNullOrWhiteSpace(termId))
            {
                return new BadRequestObjectResult("Brak semestru.");
            }

            var gradeStatus = !_thesisRepository.GetAll()
                .Any(p => !p.Hidden && p.TermId == termId && string.IsNullOrWhiteSpace(p.Grade));

            return new OkObjectResult(gradeStatus);
        }

        [HttpGet]
        public async Task<IActionResult> ExportGrades([FromQuery] string termId)
        {
            if (string.IsNullOrWhiteSpace(termId))
            {
                return new BadRequestObjectResult("Brak semestru.");
            }

            var theses = _thesisRepository.GetAll()
                .Where(p => !p.Hidden && p.TermId == termId && !string.IsNullOrEmpty(p.Grade));

            var sb = new StringBuilder();
            sb.AppendLine("os_id;grade;");
            foreach (var thesis in theses)
            {
                foreach (var author in thesis.ThesisAuthors)
                {
                    sb.AppendLine($"{author.Author.UsosId};{thesis.Grade};");
                }
            }

            var data = sb.ToString();
            var bytes = Encoding.UTF8.GetBytes(data);

            return new FileContentResult(bytes, new MediaTypeHeaderValue("application/csv"))
            {
                FileDownloadName = "Export.csv"
            };
        }
    }
}
