namespace NCU.AnnualWorks.Core.Options
{
    public class ApplicationOptions
    {
        public string[] AllowedFileExtensions { get; set; }
        public long MaxFileCount { get; set; }
        public long MaxFileSize { get; set; }
        public string DefaultAdministratorUsosId { get; set; }
        public long MaxAuthorCount { get; set; }
        public string FileStoragePath { get; set; }
    }
}
