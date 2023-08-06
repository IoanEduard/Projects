namespace Mastex.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addFK : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.tbl_spreadSheet", name: "Employee_ID", newName: "EmployeeId");
            RenameIndex(table: "dbo.tbl_spreadSheet", name: "IX_Employee_ID", newName: "IX_EmployeeId");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.tbl_spreadSheet", name: "IX_EmployeeId", newName: "IX_Employee_ID");
            RenameColumn(table: "dbo.tbl_spreadSheet", name: "EmployeeId", newName: "Employee_ID");
        }
    }
}
