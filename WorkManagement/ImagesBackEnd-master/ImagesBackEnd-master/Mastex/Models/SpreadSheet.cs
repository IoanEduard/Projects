using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Mastex.Models
{
    public class SpreadSheet
    {
        public int ID { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public ICollection<Day> Day { get; set; }

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }

    public class Day
    {
        public int ID { get; set; }
        public string DayDate { get; set; }
        public string HoursActivity { get; set; }
        public float HoursRest { get; set; }
        public float WorkedHours { get; set; }
        public float Overtime { get; set; }
        public bool OvertimeWorked { get; set; }

        public SpreadSheet SpreadSheet { get; set; }

        [NotMapped]
        public int[] HoursActivityForUI { get; set; }

        public Day()
        {

        }

        public Day(int id, string dayDate, string hoursActivity, float hoursRest, float workedHours, float overtime, bool overtimeWorked)
        {
            ID = id;
            DayDate = dayDate;
            HoursActivity = hoursActivity;
            HoursRest = hoursRest;
            WorkedHours = workedHours;
            Overtime = overtime;
            OvertimeWorked = overtimeWorked;
        }
    }
}