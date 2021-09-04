using System.Collections.Generic;

namespace NCU.AnnualWorks.Integrations.Email.Core.Models
{
    public class ReminderEmailModel
    {
        public List<string> Emails { get; set; }
        public int DaysToDeadline { get; set; }
    }
}
