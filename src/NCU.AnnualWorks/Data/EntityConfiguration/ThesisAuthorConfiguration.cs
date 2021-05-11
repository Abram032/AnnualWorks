using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Data.EntityConfiguration
{
    public class ThesisAuthorConfiguration : IEntityTypeConfiguration<ThesisAuthor>
    {
        public void Configure(EntityTypeBuilder<ThesisAuthor> builder)
        {
            builder.HasKey(p => new { p.AuthorId, p.ThesisId });
            builder.HasOne(p => p.Author).WithMany(p => p.ThesisAuthors).HasForeignKey(p => p.AuthorId);
            builder.HasOne(p => p.Thesis).WithMany(p => p.ThesisAuthors).HasForeignKey(p => p.ThesisId);
        }
    }
}
