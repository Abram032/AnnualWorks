using System.IO;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Services
{
    public interface IFileService
    {
        string GenerateChecksum(Stream file);
        Task SaveFile(Stream file, string path, string fileName);
        Task<Stream> GetFile(string path);
        Task<string> GetFileAsBase64(string path);
    }
}
