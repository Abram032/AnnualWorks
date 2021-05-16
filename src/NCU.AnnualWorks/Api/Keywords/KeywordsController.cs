using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Core.Models.Dto.Keywords;
using NCU.AnnualWorks.Core.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Keywords
{
    [Authorize(AuthorizationPolicies.AtLeastEmployee)]
    public class KeywordsController : ApiControllerBase
    {
        private readonly IAsyncRepository<Keyword> _keywordRepository;
        private readonly IMapper _mapper;
        public KeywordsController(IAsyncRepository<Keyword> keywordRepository, IMapper mapper)
        {
            _keywordRepository = keywordRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetKeywords()
        {
            var keywords = _keywordRepository.GetAll().ToList();

            var dto = _mapper.Map<List<Keyword>, List<KeywordDTO>>(keywords);

            return new OkObjectResult(dto);
        }
    }
}
