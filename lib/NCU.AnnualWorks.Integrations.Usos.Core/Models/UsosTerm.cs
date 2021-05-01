using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NCU.AnnualWorks.Integrations.Usos.Core.Models
{
    //Partial class for USOS term
    public class UsosTerm
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [JsonPropertyName("start_date")]
        public string StartDate { get; set; }
        [JsonPropertyName("end_date")]
        public string EndDate { get; set; }
        [JsonPropertyName("finish_date")]
        public string FinishDate { get; set; }
        [JsonPropertyName("name")]
        public Dictionary<string, string> Names { get; set; }
    }
}