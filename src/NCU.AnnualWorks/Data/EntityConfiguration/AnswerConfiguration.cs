using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Data.EntityConfiguration
{
    public class AnswerConfiguration : IEntityTypeConfiguration<Answer>
    {
        public void Configure(EntityTypeBuilder<Answer> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Text).HasMaxLength(2000).IsRequired();

            builder.Property(p => p.CreatedAt).ValueGeneratedOnAdd();
            builder.Property(p => p.ModifiedAt).ValueGeneratedOnUpdate().IsRequired(false);

            builder.HasOne(p => p.CreatedBy).WithMany(p => p.CreatedAnswers).IsRequired();
            builder.HasOne(p => p.ModifiedBy).WithMany(p => p.ModifiedAnswers);
        }
    }
}
