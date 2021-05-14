using Microsoft.AspNetCore.Mvc;
using NCU.AnnualWorks.Core.Models.Dto;
using NCU.AnnualWorks.Infrastructure.Data;
using NCU.AnnualWorks.Integrations.Usos.Core;
using System;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThesesController : ControllerBase
    {
        private ApiDbContext _context;
        private IUsosService _usosService;
        public ThesesController(ApiDbContext context, IUsosService usosService)
        {
            _context = context;
            _usosService = usosService;
        }

        [HttpGet]
        public IActionResult GetAllAsync()
        {
            var obj1guid = Guid.NewGuid();
            var obj2guid = Guid.NewGuid();

            var dto1 = new ThesisDTO
            {
                Guid = obj1guid,
                Title = "Tytuł pracy 1",
                Actions = new ThesisActionsDTO
                {
                    CanAddReview = true,
                    CanDownload = true,
                    CanEdit = true,
                    CanEditReview = true,
                    CanPrint = true,
                    CanView = true
                }
            };

            var dto2 = new ThesisDTO
            {
                Guid = obj2guid,
                Title = "Tytuł pracy 1",
                Actions = new ThesisActionsDTO
                {
                    CanAddReview = true,
                    CanDownload = true,
                    CanEdit = true,
                    CanEditReview = true,
                    CanPrint = true,
                    CanView = true
                }
            };

            return new OkObjectResult(new List<ThesisDTO>() { dto1, dto2 });
        }
    }
}
