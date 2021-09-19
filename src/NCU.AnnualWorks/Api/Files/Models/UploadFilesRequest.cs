using Microsoft.AspNetCore.Http;

namespace NCU.AnnualWorks.Api.Files.Models
{
    public class UploadFilesRequest
    {
        public IFormFile[] Files { get; set; }
    }
}
