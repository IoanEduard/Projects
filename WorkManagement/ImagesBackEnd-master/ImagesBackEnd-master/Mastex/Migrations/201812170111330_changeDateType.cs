namespace Mastex.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeDateType : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.tbl_employee", "BirthDate", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.tbl_employee", "BirthDate", c => c.DateTime(nullable: false));
        }
    }
}
