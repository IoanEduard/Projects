namespace Mastex.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class spreadSheet : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Days",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        DayDate = c.String(),
                        HoursActivity = c.String(),
                        HoursRest = c.Single(nullable: false),
                        WorkedHours = c.Single(nullable: false),
                        Overtime = c.Single(nullable: false),
                        SpreadSheet_ID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.tbl_spreadSheet", t => t.SpreadSheet_ID, cascadeDelete: true)
                .Index(t => t.SpreadSheet_ID);
            
            CreateTable(
                "dbo.tbl_spreadSheet",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Month = c.Int(nullable: false),
                        Year = c.Int(nullable: false),
                        Employee_ID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.tbl_employee", t => t.Employee_ID, cascadeDelete: true)
                .Index(t => t.Employee_ID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.tbl_spreadSheet", "Employee_ID", "dbo.tbl_employee");
            DropForeignKey("dbo.Days", "SpreadSheet_ID", "dbo.tbl_spreadSheet");
            DropIndex("dbo.tbl_spreadSheet", new[] { "Employee_ID" });
            DropIndex("dbo.Days", new[] { "SpreadSheet_ID" });
            DropTable("dbo.tbl_spreadSheet");
            DropTable("dbo.Days");
        }
    }
}
