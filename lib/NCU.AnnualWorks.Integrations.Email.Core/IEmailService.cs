using NCU.AnnualWorks.Integrations.Email.Core.Models;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Integrations.Email.Core
{
    public interface IEmailService
    {
        Task SendEmailGradeConflict(GradeConflictEmailModel model);
        Task SendEmailThesisCreated(ThesisCreatedEmailModel model);
    }
}
