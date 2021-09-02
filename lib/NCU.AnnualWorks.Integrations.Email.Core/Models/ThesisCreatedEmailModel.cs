using System.Collections.Generic;

namespace NCU.AnnualWorks.Integrations.Email.Core.Models
{
    public class ThesisCreatedEmailModel
    {
        public long ReviewerId { get; set; }
        public List<long> AuthorIds { get; set; }
        public string ReviewerEmail { get; set; }
        public List<string> AuthorEmails { get; set; }
        public string ThesisTitle { get; set; }
        public string Url { get; set; }
    }
}
