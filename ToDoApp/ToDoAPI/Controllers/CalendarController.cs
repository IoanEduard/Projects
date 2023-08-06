using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoAPI.DTO;

namespace ToDoAPI.Controllers
{
    public class CalendarController : RootController
    {

        private readonly DataContext _context;

        public CalendarController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("getCalendar")]
        public async Task<IActionResult> GetCalendar(CalendarDTO calendarDto)
        {
            return Ok(await GetCalendarFromDatabase(calendarDto.Id, calendarDto.Month, calendarDto.Year));
        }

        [HttpPost("getDay")]
        public async Task<IActionResult> GetDay(CalendarDTO calendarDto)
        {
            return Ok();
        }

        private async Task<Calendar> GetCalendarFromDatabase(int id, int month, int year)
        {
            if (!CalendarExists(id, month, year))
            {
                GenerateEmptyCalendar(id, year, month);
            }

            var result = _context.Calendar.Include(d => d.Day).First(x => x.Month == month && x.Year == year && x.User.UserId == id);

            //foreach (var item in result.Day)
            //{
            //    var r = GetWorkActivityForUI(item.HoursActivity);

            //    item.HoursActivityForUI = r;
            //}

            return result;
        }

        private void GenerateEmptyCalendar(int id, int year, int month)
        {
            var sp = new Calendar();

            sp.Id = 1;
            sp.Month = month;
            sp.Year = year;
            sp.Day = DaysInMonth(year, month);
            //sp.User = _context.Users.Single(e => e.UserInformation.Id == id);

            _context.Calendar.Add(sp);
            _context.SaveChanges();
        }

        private ICollection<Day> DaysInMonth(int year, int month)
        {
            var totalDays = DateTime.DaysInMonth(year, month);
            var days = new List<Day>();

            for (int i = 1; i <= totalDays; i++)
            {
                days.Add(new Day(i, new DateTime(year, month, i).ToShortDateString()));
            }

            return days;
        }

        private string GetDefaultHourActivity()
        {
            var arr = new int[48];

            return string.Join(",", arr);
        }

        private int[] GetWorkActivityForUI(string workActivity)
        {
            return workActivity.Split(',').Select(s => Convert.ToInt32(s)).ToArray();
        }

        public bool CalendarExists(int id, int month, int year)
        {
            return _context.Calendar.Any(x => x.UserId == id && x.Month == month && x.Year == year);
        }
    }
}