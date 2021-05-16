using NCU.AnnualWorks.Core.Models.Dto.Keywords;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Api.Theses.Models
{
    public class ThesisRequestData
    {
        public string Title { get; set; }
        public string Abstract { get; set; }
        public List<KeywordDTO> Keywords { get; set; }
        public List<string> AuthorUsosIds { get; set; }
        public string ReviewerUsosId { get; set; }
    }
}
