using Newtonsoft.Json;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Integrations.Usos.Core.Models
{
    //Partial class for USOS term
    public class UsosTerm
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("start_date")]
        public string StartDate { get; set; }
        [JsonProperty("end_date")]
        public string EndDate { get; set; }
        [JsonProperty("finish_date")]
        public string FinishDate { get; set; }
        [JsonProperty("name")]
        public Dictionary<string, string> Names { get; set; }
    }
}