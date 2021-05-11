using NCU.AnnualWorks.Core.Models.Enums;
using System;

namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class ThesisLog
    {
        public long Id { get; set; }
        public DateTime Timestamp { get; set; }
        public ModificationType ModificationType { get; set; }

        public Thesis Thesis { get; set; }
        public User User { get; set; }
    }
}
