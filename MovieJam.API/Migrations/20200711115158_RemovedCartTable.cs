using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MovieJam.API.Migrations
{
    public partial class RemovedCartTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cart");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cart",
                columns: table => new
                {
                    CartId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CartCollectionId = table.Column<string>(type: "TEXT", nullable: true),
                    DateStamp = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Placed = table.Column<bool>(type: "INTEGER", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cart", x => x.CartId);
                });
        }
    }
}
