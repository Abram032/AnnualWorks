using NCU.AnnualWorks.Core.Models.DbModels.Base;
using System;

namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class Settings : Entity
    {
        public string CourseCode { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public User ModifiedBy { get; set; }
    }
}
