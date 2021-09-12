using Microsoft.Extensions.Options;
using NCU.AnnualWorks.Core.Options;
using NCU.AnnualWorks.Core.Repositories;
using NCU.AnnualWorks.Core.Services;
using System;
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
        public FileService(IOptions<ApplicationOptions> options, IFileRepository fileRepository, IThesisRepository thesisRepository)
        {
            _options = options.Value;
            _fileRepository = fileRepository;
            _thesisRepository = thesisRepository;
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
            await _fileRepository.Delete(guid);
            File.Delete(GetFileSavePath(file.Path));
        }
    }
}
