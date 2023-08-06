using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DAL.Migrations
{
    public partial class deliveryMethodToCustomerBasket : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeliveryMethodId",
                table: "CustomerBasket",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CustomerBasket_DeliveryMethodId",
                table: "CustomerBasket",
                column: "DeliveryMethodId");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerBasket_DeliveryMethods_DeliveryMethodId",
                table: "CustomerBasket",
                column: "DeliveryMethodId",
                principalTable: "DeliveryMethods",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerBasket_DeliveryMethods_DeliveryMethodId",
                table: "CustomerBasket");

            migrationBuilder.DropIndex(
                name: "IX_CustomerBasket_DeliveryMethodId",
                table: "CustomerBasket");

            migrationBuilder.DropColumn(
                name: "DeliveryMethodId",
                table: "CustomerBasket");
        }
    }
}
