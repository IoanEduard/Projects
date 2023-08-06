using Mastex.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace Mastex.DAL
{
    public class EmployeeContext : DbContext
    {
        public EmployeeContext()
            : base("Name=EmployeeContext")
        {
            Configuration.ProxyCreationEnabled = false;
        }

        public DbSet<Employee> Employee { get; set; }
        public DbSet<Rank> Rank { get; set; }
        public DbSet<SpreadSheet> SpreadSheet { get; set; }
        public DbSet<Day> Days { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new EmployeeConfig());
            modelBuilder.Configurations.Add(new RankConfig());
            modelBuilder.Configurations.Add(new SpreadSheetConfig());
        }
    }

    public class EmployeeConfig : EntityTypeConfiguration<Employee>
    {
        public EmployeeConfig()
        {
            ToTable("tbl_employee");
        }
    }

    public class RankConfig : EntityTypeConfiguration<Rank>
    {
        public RankConfig()
        {
            ToTable("tbl_rank");

            HasMany(e => e.Employee)
                .WithRequired(r => r.Rank)
                .HasForeignKey(r => r.RankId);
        }
    }

    public class SpreadSheetConfig : EntityTypeConfiguration<SpreadSheet>
    {
        public SpreadSheetConfig()
        {
            ToTable("tbl_spreadSheet");

            HasRequired(e => e.Employee)
                .WithMany(s => s.SpreadSheet);

            HasMany(d => d.Day)
                .WithRequired(s => s.SpreadSheet);
        }
    }
}