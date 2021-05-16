using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Infrastructure.Data.Config
{
    public class ReviewQnAConfiguration : IEntityTypeConfiguration<ReviewQnA>
    {
        public void Configure(EntityTypeBuilder<ReviewQnA> builder)
        {
            builder.HasKey(p => new { p.ReviewId, p.QuestionId, p.AnswerId });

            builder.HasOne(p => p.Review).WithMany(p => p.ReviewQnAs).HasForeignKey(p => p.ReviewId);
            builder.HasOne(p => p.Question).WithMany(p => p.ReviewQnAs).HasForeignKey(p => p.QuestionId);
            builder.HasOne(p => p.Answer).WithOne(p => p.ReviewQnA).HasForeignKey<ReviewQnA>(p => p.AnswerId);
        }
    }
}
