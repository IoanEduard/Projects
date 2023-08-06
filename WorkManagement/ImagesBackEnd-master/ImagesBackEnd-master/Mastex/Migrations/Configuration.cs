namespace Mastex.Migrations
{
    using Mastex.Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<Mastex.DAL.EmployeeContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Mastex.DAL.EmployeeContext context)
        {
            var ranks = GetRanks().ToArray();

            context.Employee.AddOrUpdate(x => x.ID, GetEmployees(ranks).ToArray());
            context.Rank.AddOrUpdate(x => x.ID, ranks);

            context.SaveChanges();
        }

        private IEnumerable<Employee> GetEmployees(Rank[] ranks)
        {
            return new List<Employee>
            {
                new Employee { FirstName = "Gigel", LastName = "Axinte", Gender = Gender.Male.ToString(), BirthDate = DateTime.Now.AddYears(-20).ToShortDateString(), Rank = ranks[0] },
                new Employee { FirstName = "Ion", LastName = "Collins", Gender = Gender.Male.ToString(), BirthDate = DateTime.Now.AddYears(-20).ToShortDateString(), Rank = ranks[1] },
                new Employee { FirstName = "Georgescu ", LastName = "Andreia", Gender = Gender.Female.ToString(), BirthDate = DateTime.Now.AddYears(-20).ToShortDateString(), Rank = ranks[2] },
                new Employee { FirstName = "Janine", LastName = "Ana", Gender = Gender.Female.ToString(), BirthDate = DateTime.Now.AddYears(-20).ToShortDateString(), Rank = ranks[0] }
            };
        }

        private IEnumerable<Rank> GetRanks()
        {
            return new List<Rank>
            {
                new Rank { Name = "A/B Cook" },
                new Rank { Name = "A/B Motorman" },
                new Rank { Name = "Chief Engineer" },
            };
        }
    }
}
