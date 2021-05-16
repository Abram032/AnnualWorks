using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Infrastructure.Data.Config
{
    public class KeywordConfiguration : IEntityTypeConfiguration<Keyword>
    {
        public void Configure(EntityTypeBuilder<Keyword> builder)
        {
            builder.HasKey(p => p.Id);
            builder.HasAlternateKey(p => p.Text);

            builder.Property(p => p.CreatedAt).ValueGeneratedOnAdd();
            builder.Property(p => p.ModifiedAt).ValueGeneratedOnUpdate().IsRequired(false);

            builder.Property(p => p.Text).HasMaxLength(255);

            builder.HasOne(p => p.CreatedBy).WithMany(p => p.CreatedKeywords).IsRequired();
            builder.HasOne(p => p.ModifiedBy).WithMany(p => p.ModifiedKeywords);
        }
    }
}
