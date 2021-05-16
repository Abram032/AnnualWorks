using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Infrastructure.Data.Config
{
    public class ThesisAdditionalFileConfiguration : IEntityTypeConfiguration<ThesisAdditionalFile>
    {
        public void Configure(EntityTypeBuilder<ThesisAdditionalFile> builder)
        {
            builder.HasKey(p => new { p.FileId, p.ThesisId });
            builder.HasOne(p => p.Thesis).WithMany(p => p.ThesisAdditionalFiles).HasForeignKey(p => p.ThesisId);
            builder.HasOne(p => p.File).WithMany(p => p.ThesisAdditionalFiles).HasForeignKey(p => p.FileId);
        }
    }
}
