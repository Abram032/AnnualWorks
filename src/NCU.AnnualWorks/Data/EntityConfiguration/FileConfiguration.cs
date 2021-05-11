using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Data.EntityConfiguration
{
    public class FileConfiguration : IEntityTypeConfiguration<File>
    {
        public void Configure(EntityTypeBuilder<File> builder)
        {
            builder.HasKey(p => p.Id);
            builder.HasAlternateKey(p => p.Guid);

            builder.Property(p => p.CreatedAt).ValueGeneratedOnAdd();
            builder.Property(p => p.ModifiedAt).ValueGeneratedOnUpdate();

            builder.Property(p => p.FileName).IsRequired().HasMaxLength(255);
            builder.Property(p => p.Extension).IsRequired().HasMaxLength(255);
            builder.Property(p => p.Size).IsRequired();

            builder.HasOne(p => p.CreatedBy).WithMany(p => p.CreatedFiles).IsRequired();
            builder.HasOne(p => p.ModifiedBy).WithMany(p => p.ModifiedFiles);
        }
    }
}
