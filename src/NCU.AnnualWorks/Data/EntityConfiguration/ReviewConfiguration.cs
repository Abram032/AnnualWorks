using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Data.EntityConfiguration
{
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            builder.HasKey(p => p.Id);
            builder.HasAlternateKey(p => p.Guid);
            builder.Property(p => p.Guid).ValueGeneratedOnAdd();

            builder.Property(p => p.CreatedAt).ValueGeneratedOnAdd();
            builder.Property(p => p.ModifiedAt).ValueGeneratedOnUpdate().IsRequired(false);
            builder.Property(p => p.Grade).HasMaxLength(3).IsRequired();

            builder.HasOne(p => p.CreatedBy).WithMany(p => p.CreatedReviews).IsRequired();
            builder.HasOne(p => p.ModifiedBy).WithMany(p => p.ModifiedReviews);

            builder.HasOne(p => p.File).WithOne(p => p.Review).HasForeignKey<Review>(p => p.FileId);
        }
    }
}
