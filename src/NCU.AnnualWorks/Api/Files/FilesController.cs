using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Core.Extensions;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Api.Files
{
    [Authorize(AuthorizationPolicies.AuthenticatedOnly)]
    public class FilesController : ApiControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IFileRepository _fileRepository;
        private readonly IUserRepository _userRepository;
        private readonly IThesisService _thesisService;
        private readonly IUserContext _userContext;
        public FilesController(IFileService fileService, IFileRepository fileRepository,
            IUserRepository userRepository, IThesisService thesisService, IUserContext userContext)
        {
            _fileRepository = fileRepository;
            _fileService = fileService;
            _userRepository = userRepository;
            _thesisService = thesisService;
            _userContext = userContext;
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Download(Guid id)
        {
            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());
            var file = await _fileRepository.GetAsync(id);

            if (file == null)
            {
                return new NotFoundResult();
            }

            if (!file.Thesis.ThesisAuthors.Any(p => p.Author == currentUser) && !HttpContext.IsCurrentUserEmployee())
            {
                return new ForbidResult();
            }

            if (!_fileService.FileExists(file.Path))
            {
                return new NotFoundResult();
            }

            byte[] fileContent;
            using (var ms = new MemoryStream())
            {
                var stream = _fileService.GetFile(file.Path);
                await stream.CopyToAsync(ms);
                stream.Close();
                fileContent = ms.ToArray();
            }

            return new FileContentResult(fileContent, file.ContentType)
            {
                FileDownloadName = file.FileName
            };
        }

        [HttpGet("thesis/{id:guid}")]
        [Authorize(AuthorizationPolicies.AtLeastStudent)]
        public async Task<IActionResult> GetThesisFiles(Guid id)
        {
            if (!_thesisService.ThesisExists(id))
            {
                return new NotFoundResult();
            }

            var isAuthor = _thesisService.IsAuthor(id);

            if (!isAuthor && !_userContext.CurrentUser.IsEmployee)
            {
                return new ForbidResult();
            }

            var result = await _thesisService.GetThesisFiles(id);

            return new OkObjectResult(result);
        }

        [HttpPost("thesis/{id:guid}")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> AddAdditionalThesisFile(Guid id)
        {
            if (!_thesisService.ThesisExists(id))
            {
                return new NotFoundResult();
            }

            var isPromoter = _thesisService.IsPromoter(id);

            if (!isPromoter && !_userContext.CurrentUser.IsAdmin)
            {
                return new ForbidResult();
            }

            var result = await _thesisService.GetThesisFiles(id);

            return new OkObjectResult(result);
        }

        [HttpDelete("{id:guid}")]
        [Authorize(AuthorizationPolicies.AtLeastEmployee)]
        public async Task<IActionResult> DeleteAdditionalFile(Guid id)
        {
            if (!await _fileService.FileExists(id))
            {
                return new NotFoundResult();
            }

            var isPromoter = _thesisService.IsPromoter(id);

            if (!isPromoter && !_userContext.CurrentUser.IsAdmin)
            {
                return new ForbidResult();
            }

            if (!await _fileService.CanBeDeleted(id))
            {
                return new ForbidResult();
            }

            await _fileService.Delete(id);

            return new OkResult();
        }
    }
}
