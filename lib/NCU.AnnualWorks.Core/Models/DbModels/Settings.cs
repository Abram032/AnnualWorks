using System;

namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class Settings
    {
        public long Id { get; set; }
        public string CourseCode { get; set; }
        public DateTime ModifiedAt { get; set; }
        public User ModifiedBy { get; set; }
    }
}
