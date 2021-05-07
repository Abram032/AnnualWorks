using Newtonsoft.Json;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Integrations.Usos.Core.Models
{
    //Partial class for USOS user
    public class UsosUser
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("photo_urls")]
        public Dictionary<string, string> PhotoUrls { get; set; }

        [JsonProperty("last_name")]
        public string LastName { get; set; }

        [JsonProperty("first_name")]
        public string FirstName { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }
    }

    public class UsosUserPhotos
    {
        [JsonProperty("200x200")]
        public string Url_200x200 { get; set; }
    }
}
