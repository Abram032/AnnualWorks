using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Models.Dto.Terms;
using NCU.AnnualWorks.Integrations.Usos.Core;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Controllers
{
    [AutoValidateAntiforgeryToken]
    [Authorize(AuthenticationSchemes = AuthenticationSchemes.JWTAuthenticationScheme, Policy = AuthorizationPolicies.AtLeastDefault)]
    [Route("api/[controller]")]
    [ApiController]
    public class TermsController : ControllerBase
    {
        private readonly IUsosService _usosService;
        private readonly IMapper _mapper;
        public TermsController(IUsosService usosService, IMapper mapper)
        {
            _usosService = usosService;
            _mapper = mapper;
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentTerm()
        {
            var oauthRequest = HttpContext.BuildOAuthRequest();

            var usosTerm = await _usosService.GetCurrentTerm(oauthRequest);
            var term = _mapper.Map<TermDTO>(usosTerm);

            return new OkObjectResult(term);
        }

        [HttpGet]
        public async Task<IActionResult> GetTerms([FromQuery] string id)
        {
            var token = this.HttpContext.User.Claims.FirstOrDefault(c => c.Type == nameof(AuthClaims.Token)).Value;
            var oauthRequest = HttpContext.BuildOAuthRequest();

            if (string.IsNullOrWhiteSpace(id))
            {
                var usosTerms = await _usosService.GetTerms(oauthRequest);
                var terms = _mapper.Map<List<TermDTO>>(usosTerms);

                return new OkObjectResult(terms);
            }
            else
            {
                var usosTerm = await _usosService.GetTerm(oauthRequest, id);
                var term = _mapper.Map<TermDTO>(usosTerm);

                return new OkObjectResult(term);
            }
        }
    }
}
