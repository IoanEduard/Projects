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
    [RoutePrefix("")]
    public class EmployeeController : ApiController
    {
        private EmployeeContext _context = new EmployeeContext();

        public IEnumerable<Employee> GetEmployees()
        {
            return _context.Employee.Include(r => r.Rank);
        }

        [ResponseType(typeof(Employee))]
        public IHttpActionResult GetEmployee(int id)
        {
            return Ok(FindEmployee(id));
        }

        [HttpPost]
        [ResponseType(typeof(Employee))]
        public IHttpActionResult PostEmployee(Employee emp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Rank.Attach(emp.Rank);
            _context.Employee.Add(emp);
            _context.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        [HttpPut]
        [ResponseType(typeof(Employee))]
        public IHttpActionResult PutEmployee(Employee emp, int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (EmployeeExists(id))
            {
                var e = FindEmployee(id);

                e.FirstName = emp.FirstName;
                e.LastName = emp.LastName;
                e.BirthDate = emp.BirthDate;
                e.Gender = emp.Gender;
                e.RankId = emp.Rank.ID;

                _context.Entry(e).State = EntityState.Modified;
                _context.SaveChanges();
            }
            else
            {
                return NotFound();
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        [HttpDelete]
        [ResponseType(typeof(Employee))]
        public IHttpActionResult DeleteEmployee(int id)
        {
            var emp = FindEmployee(id);

            if (emp != null)
            {
                _context.Employee.Remove(emp);
                _context.SaveChanges();
            }

            return Ok(emp);
        }

        private Employee FindEmployee(int id)
        {
            return _context.Employee.Find(id);
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employee.Any(r => r.ID == id);
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
