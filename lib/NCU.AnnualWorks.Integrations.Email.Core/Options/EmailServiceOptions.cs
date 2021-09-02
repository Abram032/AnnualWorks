namespace NCU.AnnualWorks.Integrations.Email.Core.Options
{
    public class EmailServiceOptions
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool ServiceDisabled { get; set; }
        public bool DebugMode { get; set; }
        public string DebugEmail { get; set; }

        public string Domain { get; set; }
        public string Email { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
    }
}
