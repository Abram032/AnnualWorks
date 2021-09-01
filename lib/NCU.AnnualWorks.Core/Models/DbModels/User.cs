using NCU.AnnualWorks.Core.Models.DbModels.Base;
using System;
using System.Collections.Generic;

namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class User : Entity
    {
        public string UsosId { get; set; }
        public string Email { get; set; }
        public DateTime? FirstLoginAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool AdminAccess { get; set; }
        public bool CustomAccess { get; set; }


        public ICollection<ThesisAuthor> ThesisAuthors { get; set; }

        public ICollection<Thesis> CreatedTheses { get; set; }
        public ICollection<Thesis> ModifiedTheses { get; set; }
        public ICollection<Thesis> ReviewedTheses { get; set; }
        public ICollection<Thesis> PromotedTheses { get; set; }

        public ICollection<Review> CreatedReviews { get; set; }
        public ICollection<Review> ModifiedReviews { get; set; }

        public ICollection<File> CreatedFiles { get; set; }
        public ICollection<File> ModifiedFiles { get; set; }

        public ICollection<ThesisLog> ThesisLogs { get; set; }

        public ICollection<Answer> CreatedAnswers { get; set; }
        public ICollection<Answer> ModifiedAnswers { get; set; }

        public ICollection<Question> CreatedQuestions { get; set; }
        public ICollection<Question> ModifiedQuestions { get; set; }

        public ICollection<Keyword> CreatedKeywords { get; set; }
        public ICollection<Keyword> ModifiedKeywords { get; set; }

        public ICollection<Settings> ModifiedSettings { get; set; }
    }
}
