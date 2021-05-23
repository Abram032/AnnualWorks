using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        public FilesController(IFileService fileService, IFileRepository fileRepository,
            IUserRepository userRepository)
        {
            _fileRepository = fileRepository;
            _fileService = fileService;
            _userRepository = userRepository;
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> Download(Guid id)
        {
            var currentUser = await _userRepository.GetAsync(HttpContext.CurrentUserUsosId());
            var file = await _fileRepository.GetAsync(id);

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
    }
}
