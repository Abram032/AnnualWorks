using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Api.Theses.Models
{
    public class ThesisRequest
    {
        public string Data { get; set; }
        public IFormFile ThesisFile { get; set; }
        public List<IFormFile> AdditionalThesisFiles { get; set; }
    }
}