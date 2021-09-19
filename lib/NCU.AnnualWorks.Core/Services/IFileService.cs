using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Services
{
    public interface IFileService
    {
        string GenerateChecksum(Stream file);
        Task SaveFile(Stream file, string path, string fileName);
        Stream GetFile(string path);
        Task<string> GetFileAsBase64(string path);
        bool FileExists(string path);
        Task<bool> FileExists(Guid guid);
        Task<bool> CanBeDeleted(Guid guid);
        Task Delete(Guid guid);
        Task SaveAdditionalThesisFiles(Guid thesisGuid, IFormFile[] files);
    }
}
