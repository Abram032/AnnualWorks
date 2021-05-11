using System;

namespace NCU.AnnualWorks.Core.Models.DbModels
{
    public class Answer
    {
        public long Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
        public User CreatedBy { get; set; }
        public User ModifiedBy { get; set; }

        public ReviewQnA ReviewQnA { get; set; }
    }
}
