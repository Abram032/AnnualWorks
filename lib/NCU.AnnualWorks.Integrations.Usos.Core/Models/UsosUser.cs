using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NCU.AnnualWorks.Integrations.Usos.Core.Models
{
    //Partial class for USOS user
    public class UsosUser
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("photo_urls")]
        public Dictionary<string, string> PhotoUrls { get; set; }

        [JsonPropertyName("last_name")]
        public string LastName { get; set; }

        [JsonPropertyName("first_name")]
        public string FirstName { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }
    }

    public class UsosUserPhotos
    {
        [JsonPropertyName("200x200")]
        public string Url_200x200 { get; set; }
    }
}
