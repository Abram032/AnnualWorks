using Microsoft.AspNetCore.Mvc;

namespace NCU.AnnualWorks.Api
{
    [AutoValidateAntiforgeryToken]
    [Route("[controller]")]
    [ApiController]
    public abstract class ApiControllerBase : ControllerBase
    {
    }
}
