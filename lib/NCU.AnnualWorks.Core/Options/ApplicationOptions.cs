namespace NCU.AnnualWorks.Core.Options
{
    public class ApplicationOptions
    {
        public string ApplicationUrl { get; set; }
        public string[] AllowedThesisFileExtensions { get; set; }
        public string[] AllowedAdditionalFileExtensions { get; set; }
        public long MaxFileCount { get; set; }
        public long MaxFileSize { get; set; }
        public string DefaultAdministratorUsosId { get; set; }
        public long MaxAuthorCount { get; set; }
        public long MaxKeywordCount { get; set; }
        public string FileStoragePath { get; set; }
        public bool DebugMode { get; set; }
    }
}
