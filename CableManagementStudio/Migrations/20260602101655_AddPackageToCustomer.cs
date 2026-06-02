using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CableManagementStudio.Migrations
{
    /// <inheritdoc />
    public partial class AddPackageToCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PackageId",
                table: "Customers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Customers_PackageId",
                table: "Customers",
                column: "PackageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Packages_PackageId",
                table: "Customers",
                column: "PackageId",
                principalTable: "Packages",
                principalColumn: "PackageId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Packages_PackageId",
                table: "Customers");

            migrationBuilder.DropIndex(
                name: "IX_Customers_PackageId",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "PackageId",
                table: "Customers");
        }
    }
}
