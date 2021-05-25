using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace NCU.AnnualWorks.Infrastructure.Data.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UsosId = table.Column<string>(maxLength: 20, nullable: false),
                    FirstLoginAt = table.Column<DateTime>(nullable: true),
                    LastLoginAt = table.Column<DateTime>(nullable: true),
                    AdminAccess = table.Column<bool>(nullable: false, defaultValue: false),
                    CustomAccess = table.Column<bool>(nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.UniqueConstraint("AK_Users_UsosId", x => x.UsosId);
                });

            migrationBuilder.CreateTable(
                name: "Answers",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Text = table.Column<string>(maxLength: 2500, nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ModifiedAt = table.Column<DateTime>(nullable: true),
                    CreatedById = table.Column<long>(nullable: false),
                    ModifiedById = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Answers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Answers_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Answers_Users_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Files",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Guid = table.Column<Guid>(nullable: false),
                    FileName = table.Column<string>(maxLength: 255, nullable: false),
                    Path = table.Column<string>(maxLength: 255, nullable: false),
                    Size = table.Column<long>(nullable: false),
                    Extension = table.Column<string>(maxLength: 255, nullable: false),
                    ContentType = table.Column<string>(maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ModifiedAt = table.Column<DateTime>(nullable: true),
                    CreatedById = table.Column<long>(nullable: false),
                    ModifiedById = table.Column<long>(nullable: true),
                    Checksum = table.Column<string>(maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.Id);
                    table.UniqueConstraint("AK_Files_Guid", x => x.Guid);
                    table.ForeignKey(
                        name: "FK_Files_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Files_Users_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Keywords",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Text = table.Column<string>(maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ModifiedAt = table.Column<DateTime>(nullable: true),
                    CreatedById = table.Column<long>(nullable: false),
                    ModifiedById = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Keywords", x => x.Id);
                    table.UniqueConstraint("AK_Keywords_Text", x => x.Text);
                    table.ForeignKey(
                        name: "FK_Keywords_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Keywords_Users_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Order = table.Column<long>(maxLength: 3, nullable: false),
                    Text = table.Column<string>(maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ModifiedAt = table.Column<DateTime>(nullable: true),
                    CreatedById = table.Column<long>(nullable: true),
                    ModifiedById = table.Column<long>(nullable: true),
                    IsRequired = table.Column<bool>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Questions_Users_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Settings",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CourseCode = table.Column<string>(maxLength: 100, nullable: false),
                    CourseUrl = table.Column<string>(maxLength: 500, nullable: false),
                    ModifiedAt = table.Column<DateTime>(nullable: true),
                    ModifiedById = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Settings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Settings_Users_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Theses",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Guid = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(maxLength: 1000, nullable: false),
                    Abstract = table.Column<string>(maxLength: 4000, nullable: false),
                    FileId = table.Column<long>(nullable: false),
                    PromoterId = table.Column<long>(nullable: false),
                    ReviewerId = table.Column<long>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ModifiedAt = table.Column<DateTime>(nullable: true),
                    CreatedById = table.Column<long>(nullable: false),
                    ModifiedById = table.Column<long>(nullable: true),
                    TermId = table.Column<string>(maxLength: 20, nullable: false),
                    Hidden = table.Column<bool>(nullable: false),
                    Grade = table.Column<string>(maxLength: 3, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Theses", x => x.Id);
                    table.UniqueConstraint("AK_Theses_Guid", x => x.Guid);
                    table.ForeignKey(
                        name: "FK_Theses_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Theses_Files_FileId",
                        column: x => x.FileId,
                        principalTable: "Files",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Theses_Users_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Theses_Users_PromoterId",
                        column: x => x.PromoterId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Theses_Users_ReviewerId",
                        column: x => x.ReviewerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Guid = table.Column<Guid>(nullable: false),
                    CreatedAt = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ModifiedAt = table.Column<DateTime>(nullable: true),
                    CreatedById = table.Column<long>(nullable: false),
                    ModifiedById = table.Column<long>(nullable: true),
                    Grade = table.Column<string>(maxLength: 3, nullable: false),
                    IsConfirmed = table.Column<bool>(nullable: false),
                    ThesisId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.UniqueConstraint("AK_Reviews_Guid", x => x.Guid);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_Users_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reviews_Theses_ThesisId",
                        column: x => x.ThesisId,
                        principalTable: "Theses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ThesisAdditionalFiles",
                columns: table => new
                {
                    ThesisId = table.Column<long>(nullable: false),
                    FileId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThesisAdditionalFiles", x => new { x.FileId, x.ThesisId });
                    table.ForeignKey(
                        name: "FK_ThesisAdditionalFiles_Files_FileId",
                        column: x => x.FileId,
                        principalTable: "Files",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ThesisAdditionalFiles_Theses_ThesisId",
                        column: x => x.ThesisId,
                        principalTable: "Theses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ThesisAuthors",
                columns: table => new
                {
                    AuthorId = table.Column<long>(nullable: false),
                    ThesisId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThesisAuthors", x => new { x.AuthorId, x.ThesisId });
                    table.ForeignKey(
                        name: "FK_ThesisAuthors_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ThesisAuthors_Theses_ThesisId",
                        column: x => x.ThesisId,
                        principalTable: "Theses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ThesisKeywords",
                columns: table => new
                {
                    KeywordId = table.Column<long>(nullable: false),
                    ThesisId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThesisKeywords", x => new { x.ThesisId, x.KeywordId });
                    table.ForeignKey(
                        name: "FK_ThesisKeywords_Keywords_KeywordId",
                        column: x => x.KeywordId,
                        principalTable: "Keywords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ThesisKeywords_Theses_ThesisId",
                        column: x => x.ThesisId,
                        principalTable: "Theses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ThesisLogs",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Timestamp = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ModificationType = table.Column<int>(nullable: false, comment: ""),
                    ThesisId = table.Column<long>(nullable: false),
                    UserId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThesisLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ThesisLogs_Theses_ThesisId",
                        column: x => x.ThesisId,
                        principalTable: "Theses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ThesisLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReviewQnAs",
                columns: table => new
                {
                    ReviewId = table.Column<long>(nullable: false),
                    QuestionId = table.Column<long>(nullable: false),
                    AnswerId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewQnAs", x => new { x.ReviewId, x.QuestionId, x.AnswerId });
                    table.ForeignKey(
                        name: "FK_ReviewQnAs_Answers_AnswerId",
                        column: x => x.AnswerId,
                        principalTable: "Answers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReviewQnAs_Questions_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReviewQnAs_Reviews_ReviewId",
                        column: x => x.ReviewId,
                        principalTable: "Reviews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Answers_CreatedById",
                table: "Answers",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Answers_ModifiedById",
                table: "Answers",
                column: "ModifiedById");

            migrationBuilder.CreateIndex(
                name: "IX_Files_CreatedById",
                table: "Files",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Files_ModifiedById",
                table: "Files",
                column: "ModifiedById");

            migrationBuilder.CreateIndex(
                name: "IX_Keywords_CreatedById",
                table: "Keywords",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Keywords_ModifiedById",
                table: "Keywords",
                column: "ModifiedById");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_CreatedById",
                table: "Questions",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_ModifiedById",
                table: "Questions",
                column: "ModifiedById");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewQnAs_AnswerId",
                table: "ReviewQnAs",
                column: "AnswerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ReviewQnAs_QuestionId",
                table: "ReviewQnAs",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_CreatedById",
                table: "Reviews",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ModifiedById",
                table: "Reviews",
                column: "ModifiedById");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_ThesisId",
                table: "Reviews",
                column: "ThesisId");

            migrationBuilder.CreateIndex(
                name: "IX_Settings_ModifiedById",
                table: "Settings",
                column: "ModifiedById");

            migrationBuilder.CreateIndex(
                name: "IX_Theses_CreatedById",
                table: "Theses",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Theses_FileId",
                table: "Theses",
                column: "FileId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Theses_ModifiedById",
                table: "Theses",
                column: "ModifiedById");

            migrationBuilder.CreateIndex(
                name: "IX_Theses_PromoterId",
                table: "Theses",
                column: "PromoterId");

            migrationBuilder.CreateIndex(
                name: "IX_Theses_ReviewerId",
                table: "Theses",
                column: "ReviewerId");

            migrationBuilder.CreateIndex(
                name: "IX_ThesisAdditionalFiles_ThesisId",
                table: "ThesisAdditionalFiles",
                column: "ThesisId");

            migrationBuilder.CreateIndex(
                name: "IX_ThesisAuthors_ThesisId",
                table: "ThesisAuthors",
                column: "ThesisId");

            migrationBuilder.CreateIndex(
                name: "IX_ThesisKeywords_KeywordId",
                table: "ThesisKeywords",
                column: "KeywordId");

            migrationBuilder.CreateIndex(
                name: "IX_ThesisLogs_ThesisId",
                table: "ThesisLogs",
                column: "ThesisId");

            migrationBuilder.CreateIndex(
                name: "IX_ThesisLogs_UserId",
                table: "ThesisLogs",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReviewQnAs");

            migrationBuilder.DropTable(
                name: "Settings");

            migrationBuilder.DropTable(
                name: "ThesisAdditionalFiles");

            migrationBuilder.DropTable(
                name: "ThesisAuthors");

            migrationBuilder.DropTable(
                name: "ThesisKeywords");

            migrationBuilder.DropTable(
                name: "ThesisLogs");

            migrationBuilder.DropTable(
                name: "Answers");

            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "Keywords");

            migrationBuilder.DropTable(
                name: "Theses");

            migrationBuilder.DropTable(
                name: "Files");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
