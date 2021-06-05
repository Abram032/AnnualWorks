using Newtonsoft.Json;

namespace NCU.AnnualWorks.Integrations.Usos.Core.Models
{
    public class UsosUserSearchResponse
    {
        [JsonProperty("items")]
        public Item[] Items { get; set; }
    }

    public class Item
    {
        [JsonProperty("user")]
        public UsosUser User { get; set; }
    }
}