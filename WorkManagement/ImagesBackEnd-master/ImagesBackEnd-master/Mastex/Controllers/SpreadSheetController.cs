using Mastex.DAL;
using Mastex.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;

namespace Mastex.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/SpreadSheet")]
    public class SpreadSheetController : ApiController
    {
        private EmployeeContext _context = new EmployeeContext();

        [ResponseType(typeof(SpreadSheet))]
        [Route("GetSpreadSheet/{id}/{month}/{year}")]
        [HttpGet]
        public IHttpActionResult GetSpreadSheet(int id, int month, int year)
        {
            return Ok(GetSpread(id, month, year));
        }

        private SpreadSheet GetSpread(int id, int month, int year)
        {
            if (!SpreadSheetExists(id, month, year))
            {
                GenerateEmptySpreadsheet(id, year, month);
            }

            var result = _context.SpreadSheet.Include("Day").First(x => x.Month == month && x.Year == year && x.EmployeeId == id);

            foreach (var item in result.Day)
            {
                var r = GetWorkActivityForUI(item.HoursActivity);

                item.HoursActivityForUI = r;
            }

            return result;
        }

        private int[] GetWorkActivityForUI(string workActivity)
        {
            return workActivity.Split(',').Select(s => Convert.ToInt32(s)).ToArray();
        }

        public bool SpreadSheetExists(int id, int month, int year)
        {
            return _context.SpreadSheet.Any(x => x.EmployeeId == id && x.Month == month && x.Year == year);
        }

        private void GenerateEmptySpreadsheet(int id, int year, int month)
        {
            var sp = new SpreadSheet();

            sp.ID = 1;
            sp.Month = month;
            sp.Year = year;
            sp.Day = DaysInMonth(year, month);
            sp.Employee = _context.Employee.Single(e => e.ID == id);

            _context.SpreadSheet.Add(sp);
            _context.SaveChanges();
        }

        private ICollection<Day> DaysInMonth(int year, int month)
        {
            var totalDays = DateTime.DaysInMonth(year, month);
            var days = new List<Day>();

            for (int i = 1; i <= totalDays; i++)
            {
                days.Add(new Day(i, new DateTime(year, month, i).ToShortDateString(), GetDefaultHourActivity(), 24f, 0f, 0f, false));
            }

            return days;
        }

        private string GetDefaultHourActivity()
        {
            var arr = new int[48];

            return string.Join(",", arr);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}
