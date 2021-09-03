using System.Collections.Generic;

namespace NCU.AnnualWorks.Integrations.Email.Core.Models
{
    public class GradeConfirmedEmailModel
    {
        public List<long> UserIds { get; set; }
        public List<string> Emails { get; set; }
        public string ThesisTitle { get; set; }
        public string Url { get; set; }
    }
}
