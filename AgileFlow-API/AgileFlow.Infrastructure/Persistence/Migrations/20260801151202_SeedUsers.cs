using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgileFlow.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Name", "Email", "PasswordHash", "CreatedAt" },
                values: new object[,]
                {
            {
                Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                "Admin User",
                "admin@agileflow.com",
                BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                DateTime.UtcNow
            },
            {
                Guid.Parse("b2c3d4e5-f6a7-8901-bcde-f12345678901"),
                "Dev User",
                "dev@agileflow.com",
                BCrypt.Net.BCrypt.HashPassword("Dev123!"),
                DateTime.UtcNow
            }
                }
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValues: new object[]
                {
                    Guid.Parse("a1b2c3d4-e5f6-7890-abcd-ef1234567890"),
                    Guid.Parse("b2c3d4e5-f6a7-8901-bcde-f12345678901")
                }
            );
        }
    }
}
