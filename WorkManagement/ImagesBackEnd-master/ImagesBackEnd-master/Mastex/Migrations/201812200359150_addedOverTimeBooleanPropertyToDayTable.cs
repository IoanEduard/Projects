namespace Mastex.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addedOverTimeBooleanPropertyToDayTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Days", "OvertimeWorked", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Days", "OvertimeWorked");
        }
    }
}
