using Microsoft.AspNetCore.Mvc;

namespace NCU.AnnualWorks.Api
{
    //[Authorize(AuthenticationSchemes = AuthenticationSchemes.JWTAuthenticationScheme, Policy = AuthorizationPolicies.AtLeastDefault)]
    [AutoValidateAntiforgeryToken]
    [Route("api/[controller]")]
    [ApiController]
    public abstract class ApiControllerBase : ControllerBase
    {
    }
}
