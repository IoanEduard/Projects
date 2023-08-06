using Mastex.DAL;
using Mastex.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;

namespace Mastex.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/Day")]
    public class DayController : ApiController
    {
        private EmployeeContext _context = new EmployeeContext();

        [ResponseType(typeof(Day))]
        [Route("PutWorkDay/{id}/{startWorkDay}/{endWorkDay}")]
        [HttpPut]
        public IHttpActionResult PutWorkDay(Day day, int id, float startWorkDay, float endWorkDay)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (DayOfWorkExists(id))
            {
                var d = FindDay(id);

                var hoursWorked = GetHoursWorked(startWorkDay, endWorkDay);
                var hoursRest = GetHoursRest(hoursWorked);
                var overTime = GetOvertime(hoursWorked);         
                var hoursActivity = UpdateWorkDays(day.HoursActivity, startWorkDay, endWorkDay);
                var isOverTimeDay = Overtime(overTime);

                d.HoursActivity = hoursActivity;
                d.WorkedHours = hoursWorked;
                d.HoursRest = hoursRest;
                d.Overtime = overTime;
                d.OvertimeWorked = isOverTimeDay;

                _context.Entry(d).State = EntityState.Modified;
                _context.SaveChanges();
            }
            else
            {
                return NotFound();
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        private Day GetTestDay(int id)
        {
            return _context.Days.Find(id);
        }

        private static string UpdateWorkDays(string workedHours, float startWorkDay, float endWorkDay)
        {
            var temp = workedHours.Split(',').Select(s => Convert.ToInt32(s)).ToArray();

            for (int i = 0; i < temp.Length - 1; i++)
            {
                if (i >= startWorkDay && i <= endWorkDay)
                {
                    temp[i] = 1;
                }
                else
                {
                    if(temp[i] == 1)
                    {
                        temp[i] = 0;
                    }
                }
            }

            return string.Join(",", temp);
        }

        private float GetHoursWorked(float startWorkDay, float endWorkDay)
        {
            return endWorkDay - startWorkDay;
        }

        private float GetHoursRest(float hoursWorked)
        {
            return 24 - hoursWorked;
        }

        private float GetOvertime(float hoursWorked)
        {
            return hoursWorked - 8 > 0 ? hoursWorked - 8 : 0;
        }

        private Day FindDay(int id)
        {
            return _context.Days.Find(id);
        }

        private bool DayOfWorkExists(int id)
        {
            return _context.Days.Any(r => r.ID == id);
        }

        private bool Overtime(float overtime)
        {
            return overtime > 0;
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
