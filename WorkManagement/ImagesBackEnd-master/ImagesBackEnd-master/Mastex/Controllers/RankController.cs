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
    public class RankController : ApiController
    {
        private EmployeeContext _context = new EmployeeContext();

        public IEnumerable<Rank> GetRanks()
        {
            return _context.Rank;
        }

        [ResponseType(typeof(Rank))]
        public IHttpActionResult GetRank(int id)
        {
            return Ok(FindRank(id));
        }

        [HttpPost]
        [ResponseType(typeof(Rank))]
        public IHttpActionResult PostRank(Rank rank)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Rank.Add(rank);
            _context.SaveChanges();

            //return CreatedAtRoute("DefaultApi", new { rank.ID }, rank);
            return StatusCode(HttpStatusCode.NoContent);
        }

        [HttpPut]
        [ResponseType(typeof(Rank))]
        public IHttpActionResult PutRank(Rank rank, int id)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            if (RankExists(id))
            {
                _context.Entry(rank).State = EntityState.Modified;
                _context.SaveChanges();
            }
            else
            {
                return NotFound();
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        [HttpDelete]
        [ResponseType(typeof(Rank))]
        public IHttpActionResult DeleteRank(int id)
        {
            var rank = FindRank(id);

            if (rank != null)
            {
                _context.Rank.Remove(rank);
                _context.SaveChanges();
            }

            return Ok(rank);
        }

        private Rank FindRank(int id)
        {
            return _context.Rank.Find(id);
        }

        private bool RankExists(int id)
        {
            return _context.Rank.Any(r => r.ID == id);
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
