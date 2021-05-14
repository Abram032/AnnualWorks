using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Infrastructure.Data.Config
{
    public class SettingsConfiguration : IEntityTypeConfiguration<Settings>
    {
        public void Configure(EntityTypeBuilder<Settings> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.CourseCode).IsRequired().HasMaxLength(100);

            builder.Property(p => p.ModifiedAt).ValueGeneratedOnAddOrUpdate().IsRequired(false);

            builder.HasOne(p => p.ModifiedBy).WithMany(p => p.ModifiedSettings);
        }
    }
}
