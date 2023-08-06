using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Mastex.Models
{
    public class Employee
    {
        public int ID { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string BirthDate { get; set; }
        public string Gender { get; set; }

        public int RankId { get; set; }
        public Rank Rank { get; set; }

        public ICollection<SpreadSheet> SpreadSheet { get; set; }
    }
}
