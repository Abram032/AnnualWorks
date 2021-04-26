using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NCU.AnnualWorks.Authentication.Core.Constants;
using System;
using System.Collections.Generic;
using System.Linq;

namespace NCU.AnnualWorks.Controllers
{
    [Authorize(AuthenticationSchemes = AuthenticationSchemes.JWTAuthenticationScheme)]
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IConfiguration _config;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            var user = this.HttpContext.User;
            Console.WriteLine(_config["DB_CONNECTION_STRING"]);
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = _config["DB_CONNECTION_STRING"] //Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }
}
