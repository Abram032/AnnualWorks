using System.Collections.Generic;

namespace NCU.AnnualWorks.Api.Users.Models
{
    public class UpdateAdminsRequest
    {
        public List<string> UserIds { get; set; }
    }
}
