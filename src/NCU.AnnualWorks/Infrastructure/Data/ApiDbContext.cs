using Microsoft.EntityFrameworkCore;
using NCU.AnnualWorks.Core.Models.DbModels;
using NCU.AnnualWorks.Infrastructure.Data.Config;

namespace NCU.AnnualWorks.Infrastructure.Data
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Answer> Answers { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<Keyword> Keywords { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ReviewQnA> ReviewQnAs { get; set; }
        public DbSet<Settings> Settings { get; set; }
        public DbSet<ThesisAdditionalFile> ThesisAdditionalFiles { get; set; }
        public DbSet<ThesisAuthor> ThesisAuthors { get; set; }
        public DbSet<Thesis> Theses { get; set; }
        public DbSet<ThesisKeyword> ThesisKeywords { get; set; }
        public DbSet<ThesisLog> ThesisLogs { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new AnswerConfiguration());
            modelBuilder.ApplyConfiguration(new FileConfiguration());
            modelBuilder.ApplyConfiguration(new KeywordConfiguration());
            modelBuilder.ApplyConfiguration(new QuestionConfiguration());
            modelBuilder.ApplyConfiguration(new ReviewConfiguration());
            modelBuilder.ApplyConfiguration(new ReviewQnAConfiguration());
            modelBuilder.ApplyConfiguration(new SettingsConfiguration());
            modelBuilder.ApplyConfiguration(new ThesisAdditionalFileConfiguration());
            modelBuilder.ApplyConfiguration(new ThesisAuthorConfiguration());
            modelBuilder.ApplyConfiguration(new ThesisConfiguration());
            modelBuilder.ApplyConfiguration(new ThesisKeywordConfiguration());
            modelBuilder.ApplyConfiguration(new ThesisLogConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
        }
    }
}
