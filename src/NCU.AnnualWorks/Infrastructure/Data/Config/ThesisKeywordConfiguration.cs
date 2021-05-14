using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Infrastructure.Data.Config
{
    public class ThesisKeywordConfiguration : IEntityTypeConfiguration<ThesisKeyword>
    {
        public void Configure(EntityTypeBuilder<ThesisKeyword> builder)
        {
            builder.HasKey(p => new { p.ThesisId, p.KeywordId });
            builder.HasOne(p => p.Keyword).WithMany(p => p.ThesisKeywords).HasForeignKey(p => p.KeywordId);
            builder.HasOne(p => p.Thesis).WithMany(p => p.ThesisKeywords).HasForeignKey(p => p.ThesisId);
        }
    }
}
