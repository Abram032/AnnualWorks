using NCU.AnnualWorks.Core.Models.Dto.Users;
using NCU.AnnualWorks.Core.Models.Enums;
using System;

namespace NCU.AnnualWorks.Core.Models.Dto.Thesis
{
    public class ThesisLogDTO
    {
        public DateTime Timestamp { get; set; }
        public ModificationType ModificationType { get; set; }
        public UserDTO User { get; set; }
    }
}
