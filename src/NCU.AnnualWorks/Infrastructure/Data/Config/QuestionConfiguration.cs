using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Infrastructure.Data.Config
{
    public class QuestionConfiguration : IEntityTypeConfiguration<Question>
    {
        public void Configure(EntityTypeBuilder<Question> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Order).HasMaxLength(3).IsRequired();
            builder.Property(p => p.Text).HasMaxLength(500).IsRequired();
            builder.Property(p => p.IsActive).IsRequired();

            builder.Property(p => p.CreatedAt).ValueGeneratedOnAdd();
            builder.Property(p => p.ModifiedAt).ValueGeneratedOnUpdate().IsRequired(false);

            builder.HasOne(p => p.CreatedBy).WithMany(p => p.CreatedQuestions).IsRequired();
            builder.HasOne(p => p.ModifiedBy).WithMany(p => p.ModifiedQuestions);
        }
    }
}
