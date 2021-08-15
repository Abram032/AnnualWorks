using Microsoft.AspNetCore.Mvc;

namespace NCU.AnnualWorks.Api
{
    [AutoValidateAntiforgeryToken]
    [Route("api/[controller]")]
    [ApiController]
    public abstract class ApiControllerBase : ControllerBase
    {
    }
}
