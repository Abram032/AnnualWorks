using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Data.EntityConfiguration
{
    public class ThesisConfiguration : IEntityTypeConfiguration<Thesis>
    {
        public void Configure(EntityTypeBuilder<Thesis> builder)
        {
            builder.HasKey(p => p.Id);
            builder.HasAlternateKey(p => p.Guid);

            builder.Property(p => p.Title).IsRequired().HasMaxLength(1000);
            builder.Property(p => p.Abstract).IsRequired().HasMaxLength(4000);

            builder.Property(p => p.Grade).HasMaxLength(3);
            builder.Property(p => p.TermId).HasMaxLength(20).IsRequired();

            builder.Property(p => p.CreatedAt).ValueGeneratedOnAdd();
            builder.Property(p => p.ModifiedAt).ValueGeneratedOnUpdate();

            builder.HasOne(p => p.Reviewer).WithMany(p => p.ReviewedTheses).IsRequired();
            builder.HasOne(p => p.Promoter).WithMany(p => p.PromotedTheses).IsRequired();
            builder.HasOne(p => p.CreatedBy).WithMany(p => p.CreatedTheses).IsRequired();
            builder.HasOne(p => p.ModifiedBy).WithMany(p => p.ModifiedTheses);

            builder.HasMany(p => p.Reviews).WithOne(p => p.Thesis).IsRequired();

            builder.HasOne(p => p.File).WithOne(p => p.Thesis).HasForeignKey<Thesis>(p => p.FileId).IsRequired();
        }
    }
}
