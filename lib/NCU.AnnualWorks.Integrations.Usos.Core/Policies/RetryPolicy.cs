namespace NCU.AnnualWorks.Integrations.Usos.Core.Policies
{
    public static class RetryPolicy
    {
        //TODO: Implement retry policy via polly
        //public static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
        //{
        //    return HttpPolicyExtensions
        //        .HandleTransientHttpError()
        //        .OrResult(msg => msg.StatusCode == System.Net.HttpStatusCode.NotFound)
        //        .WaitAndRetryAsync(6, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
        //}
    }
}
