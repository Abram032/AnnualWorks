using Microsoft.AspNetCore.Mvc;

namespace NCU.AnnualWorks.Api
{
    //[AutoValidateAntiforgeryToken]
    //[Authorize(AuthenticationSchemes = AuthenticationSchemes.JWTAuthenticationScheme, Policy = AuthorizationPolicies.AtLeastDefault)]
    [Route("api/[controller]")]
    [ApiController]
    public abstract class ApiControllerBase : ControllerBase
    {
    }
}
