using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.DAL.Migrations
{
    public partial class deliveryMethodToCustomerBasket2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerBasket_DeliveryMethods_DeliveryMethodId",
                table: "CustomerBasket");

            migrationBuilder.AlterColumn<int>(
                name: "DeliveryMethodId",
                table: "CustomerBasket",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerBasket_DeliveryMethods_DeliveryMethodId",
                table: "CustomerBasket",
                column: "DeliveryMethodId",
                principalTable: "DeliveryMethods",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerBasket_DeliveryMethods_DeliveryMethodId",
                table: "CustomerBasket");

            migrationBuilder.AlterColumn<int>(
                name: "DeliveryMethodId",
                table: "CustomerBasket",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerBasket_DeliveryMethods_DeliveryMethodId",
                table: "CustomerBasket",
                column: "DeliveryMethodId",
                principalTable: "DeliveryMethods",
                principalColumn: "Id");
        }
    }
}
