using NCU.AnnualWorks.Core.Models.DbModels;
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

        public static List<UserDTO> ToDto(this IEnumerable<UsosUser> usosUsers)
        {
            return usosUsers.Select(u => u.ToDto()).ToList();
        }

        public static User ToDbModel(this UsosUser usosUser)
        {
            return new User
            {
                Id = long.Parse(usosUser.Id),
                UsosId = usosUser.Id
            };
        }

        public static List<User> ToDbModel(this IEnumerable<UsosUser> usosUsers)
        {
            return usosUsers.Select(u => u.ToDbModel()).ToList();
        }
    }
}
