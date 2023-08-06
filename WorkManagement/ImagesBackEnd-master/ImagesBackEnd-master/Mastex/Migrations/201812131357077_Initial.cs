namespace Mastex.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.tbl_employee",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        LastName = c.String(),
                        FirstName = c.String(),
                        BirthDate = c.DateTime(nullable: false),
                        Gender = c.String(),
                        RankId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.tbl_rank", t => t.RankId, cascadeDelete: true)
                .Index(t => t.RankId);
            
            CreateTable(
                "dbo.tbl_rank",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.ID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.tbl_employee", "RankId", "dbo.tbl_rank");
            DropIndex("dbo.tbl_employee", new[] { "RankId" });
            DropTable("dbo.tbl_rank");
            DropTable("dbo.tbl_employee");
        }
    }
}
