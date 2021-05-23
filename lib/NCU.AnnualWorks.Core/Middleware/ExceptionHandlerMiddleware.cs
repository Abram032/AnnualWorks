using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Integrations.Usos.Core.Exceptions;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Core.Middleware
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        private readonly IJWTAuthenticationService _jwtService;
        public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger,
            IJWTAuthenticationService jwtService)
        {
            _next = next;
            _logger = logger;
            _jwtService = jwtService;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, exception.Message);

                string message = string.Empty;
                var response = context.Response;
                response.ContentType = "application/json";

                switch (exception)
                {
                    case UsosConnectionException e:
                        message = "Brak połączenia z serwisem USOS";
                        break;
                    case UsosUnauthorizedException e:
                        response.Cookies.Delete(AuthenticationCookies.SecureAuth, _jwtService.GetAuthCookieOptions());
                        response.Cookies.Delete(AuthenticationCookies.SecureUser, _jwtService.GetUserCookieOptions());
                        response.Cookies.Delete(AuthenticationCookies.SecureToken, _jwtService.GetTokenCookieOptions());
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        message = "Błąd autoryzacyjny serwisu USOS";
                        break;
                    default:
                        // unhandled error
                        response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        message = "Wewnętrzny błąd serwera";
                        break;
                }


                await response.WriteAsync(JsonConvert.SerializeObject(new { errorMessage = message }));
            }
        }
    }
}
