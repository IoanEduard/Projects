using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DAL.Migrations
{
    public partial class StateField2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Address",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "State",
                table: "Address");
        }
    }
}
