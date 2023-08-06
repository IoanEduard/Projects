using Core.Entities.Identity;

namespace Core.Entities
{
    public class Calendar
    {
        public int Id {get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public ICollection<Day> Day { get; set; }

        public int UserId { get; set; }
        public UserInformation User { get; set; }
    }
    
    public class Day
    {
        public int Id { get; set; }
        public string DayDate { get; set; }

        public Day(int id, string dayDate)
        {
            Id = id;
            DayDate = dayDate;
        }
    }
}