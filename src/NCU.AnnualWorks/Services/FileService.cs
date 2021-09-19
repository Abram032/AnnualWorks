using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Authentication.JWT.Core.Abstractions;
using NCU.AnnualWorks.Core.Models.Enums;
using NCU.AnnualWorks.Core.Options;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Services
{
    public class FileService : IFileService
    {
        private readonly ApplicationOptions _options;
        private readonly IFileRepository _fileRepository;
        private readonly IThesisRepository _thesisRepository;
        private readonly ILogger _logger;
        private readonly IUserContext _userContext;
        private readonly IUserRepository _userRepository;
        private readonly IThesisService _thesisService;
        public FileService(IOptions<ApplicationOptions> options, IFileRepository fileRepository, IThesisRepository thesisRepository,
            ILogger<FileService> logger, IUserContext userContext, IUserRepository userRepository, IThesisService thesisService)
        {
            _options = options.Value;
            _fileRepository = fileRepository;
            _thesisRepository = thesisRepository;
            _logger = logger;
            _userContext = userContext;
            _userRepository = userRepository;
            _thesisService = thesisService;
        }

        public string GenerateChecksum(Stream file)
        {
            string checksum = null;
            using (var sha256Hash = SHA256.Create())
            {
                byte[] data = sha256Hash.ComputeHash(file);
                var sb = new StringBuilder();
                for (int i = 0; i < data.Length; i++)
                {
                    sb.Append(data[i].ToString("x2"));
                }
                checksum = sb.ToString();
            }
            file.Position = 0;
            return checksum;
        }

        public string GetFileSavePath(string path)
            => Path.Combine(Directory.GetCurrentDirectory(), _options.FileStoragePath, path);

        public Stream GetFile(string path)
            => File.OpenRead(GetFileSavePath(path));

        public Task<string> GetFileAsBase64(string path)
        {
            throw new NotImplementedException();
        }

        public bool FileExists(string path)
            => File.Exists(GetFileSavePath(path));

        public async Task<bool> FileExists(Guid guid)
            => await _fileRepository.Exists(guid);

        public async Task<bool> CanBeDeleted(Guid guid)
        {
            var file = await _fileRepository.GetAsync(guid);
            var thesisGuid = file.Thesis != null ? file.Thesis.Guid : file.ThesisAdditionalFiles.FirstOrDefault().Thesis.Guid;
            var isPromoter = _thesisService.IsPromoter(thesisGuid);

            if (!isPromoter && !_userContext.CurrentUser.IsAdmin)
            {
                return false;
            }

            return !_thesisRepository.GetAll().Any(t => t.FileId == file.Id);
        }

        public async Task SaveFile(Stream file, string path, string fileName)
        {
            var savePath = GetFileSavePath(path);
            Directory.CreateDirectory(savePath);

            using (var fs = File.Create(Path.Combine(savePath, fileName)))
            {
                file.Seek(0, SeekOrigin.Begin);
                await file.CopyToAsync(fs);
            }
        }

        public async Task Delete(Guid guid)
        {
            var file = await _fileRepository.GetAsync(guid);
            var user = await _userRepository.GetAsync(_userContext.CurrentUser.Id);
            var thesis = file.Thesis != null ? file.Thesis : file.ThesisAdditionalFiles.FirstOrDefault().Thesis;

            await _fileRepository.Delete(guid);
            thesis.LogChange(user, ModificationType.AdditionalFilesRemoved);
            await _thesisRepository.UpdateAsync(thesis);
            File.Delete(GetFileSavePath(file.Path));
        }

        public async Task SaveAdditionalThesisFiles(Guid thesisGuid, IFormFile[] files)
        {
            var thesis = await _thesisRepository.GetAsync(thesisGuid);
            var user = await _userRepository.GetAsync(_userContext.CurrentUser.Id);
            foreach (var file in files)
            {
                try
                {
                    var fileGuid = Guid.NewGuid();
                    var thesisFile = new Core.Models.DbModels.File
                    {
                        Guid = fileGuid,
                        FileName = file.FileName,
                        Extension = Path.GetExtension(file.FileName),
                        Path = Path.Combine(thesisGuid.ToString(), fileGuid.ToString()),
                        ContentType = file.ContentType,
                        CreatedBy = user,
                        Size = file.Length,
                        Checksum = GenerateChecksum(file.OpenReadStream())
                    };

                    if (thesis.ThesisAdditionalFiles == null)
                    {
                        thesis.ThesisAdditionalFiles = new List<Core.Models.DbModels.ThesisAdditionalFile>();
                    }

                    await SaveFile(file.OpenReadStream(), thesisGuid.ToString(), fileGuid.ToString());

                    thesis.ThesisAdditionalFiles.Add(new Core.Models.DbModels.ThesisAdditionalFile
                    {
                        Thesis = thesis,
                        File = thesisFile
                    });
                    thesis.LogChange(user, ModificationType.AddtionalFilesAdded);
                    await _thesisRepository.UpdateAsync(thesis);
                }
                catch (Exception e)
                {
                    _logger.LogError($"Failed to save file. Reason: {e.Message}");
                }
            }
        }
    }
}
