using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Data.EntityConfiguration
{
    public class ThesisLogConfiguration : IEntityTypeConfiguration<ThesisLog>
    {
        public void Configure(EntityTypeBuilder<ThesisLog> builder)
        {
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Timestamp).ValueGeneratedOnAdd();
            builder.Property(p => p.ModificationType).IsRequired().HasComment("");

            builder.HasOne(p => p.User).WithMany(p => p.ThesisLogs).IsRequired();
            builder.HasOne(p => p.Thesis).WithMany(p => p.ThesisLogs).IsRequired();
        }
    }
}
