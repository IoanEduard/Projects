using System.Reflection;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Core.Entities.Task> Tasks {get;set;}
        public DbSet<Comment> Comments{get;set; }
        public DbSet<User> Users {get;set;}
        public DbSet<Project> Projects {get;set;}
        public DbSet<Calendar> Calendar { get;set; }
        public DbSet<Day> Days { get;set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}