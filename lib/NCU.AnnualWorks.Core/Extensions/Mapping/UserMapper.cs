using NCU.AnnualWorks.Core.Models.Dto.Users;
using NCU.AnnualWorks.Integrations.Usos.Core.Models;
using System.Collections.Generic;
using System.Linq;

namespace NCU.AnnualWorks.Core.Extensions.Mapping
{
    public static class UserMapper
    {
        public static UserDTO ToDto(this UsosUser usosUser)
        {
            return new UserDTO
            {
                UsosId = usosUser.Id,
                FirstName = usosUser.FirstName,
                LastName = usosUser.LastName,
                Email = usosUser.Email,
                PhotoUrl = usosUser.PhotoUrls.Values.FirstOrDefault()
            };
        }

        public static IEnumerable<UserDTO> ToDto(this IEnumerable<UsosUser> usosUsers)
        {
            return usosUsers.Select(u => u.ToDto());
        }
    }
}
