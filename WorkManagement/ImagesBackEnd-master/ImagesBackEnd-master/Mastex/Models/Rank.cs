using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Mastex.Models
{
    public class Rank
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public ICollection<Employee> Employee { get; set; }
    }
}