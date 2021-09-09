using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Extensions.Mapping;
using NCU.AnnualWorks.Core.Models.Dto.Terms;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Integrations.Usos.Core;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Terms
{
    [Authorize(AuthorizationPolicies.AuthenticatedOnly)]
    public class TermsController : ApiControllerBase
    {
        private readonly IThesisRepository _thesisRepository;
        private readonly IUsosService _usosService;
        private readonly IMapper _mapper;
        private readonly IUserContext _userContext;
        public TermsController(IUsosService usosService, IMapper mapper, IThesisRepository thesisRepository, IUserContext userContext)
        {
            _thesisRepository = thesisRepository;
            _usosService = usosService;
            _mapper = mapper;
            _userContext = userContext;
        }

        [HttpGet("Current")]
        public async Task<IActionResult> GetCurrentTerm()
        {
            var oauthRequest = HttpContext.BuildOAuthRequest();

            var usosTerm = await _usosService.GetCurrentTerm(oauthRequest);
            var term = _mapper.Map<TermDTO>(usosTerm);

            return new OkObjectResult(term);
        }

        [HttpGet("All")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> GetAllTerms()
        {
            var thesisTerms = _thesisRepository.GetAll().Select(t => t.TermId).Distinct().ToList();
            var terms = new List<TermDTO>();

            if (thesisTerms.Count != 0)
            {
                var usosTerms = await _usosService.GetTerms(_userContext.GetCredentials());
                terms.AddRange(usosTerms.Where(t => thesisTerms.Contains(t.Id)).ToDto());
            }

            var currentTerm = await _usosService.GetCurrentTerm(_userContext.GetCredentials());

            if (terms.FirstOrDefault(t => t.Id == currentTerm.Id) == null)
            {
                terms.Add(currentTerm.ToDto());
            }

            return new OkObjectResult(terms);
        }

        [HttpGet]
        public async Task<IActionResult> GetTermOrTerms([FromQuery] string id)
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
