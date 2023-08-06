using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repository
{
    public class UpcomingTasksRepository : GenericRepository<UpcomingTask>,
                                           IUpcomingTasksRepository
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        public UpcomingTasksRepository(DataContext context, IMapper mapper) : base(context, mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<UpcomingTask>> GetAllOrderedByDateAscending()
        {
            var result = await _context.Tasks.Include(c => c.Comments).ToListAsync();

            return result.GroupBy(t => t.DateToComplete.Date)
                        .Select(r => r).Select(r => new UpcomingTask
                        {
                            Date = r.Key,
                            Count = r.Count(),
                            Tasks = r.Select(r => r).ToList()
                        }).OrderBy(d => d.Date).ToList();

        }

        public async Task<IReadOnlyList<UpcomingTask>> GetAllOrderedByDateDescending()
        {
            var result = await _context.Tasks.Include(c => c.Comments).ToListAsync();

            return result.GroupBy(t => t.DateToComplete.Date)
                       .Select(r => r).Select(r => new UpcomingTask
                       {
                           Date = r.Key,
                           Count = r.Count(),
                           Tasks = r.Select(r => r).ToList()
                       }).OrderByDescending(d => d.Date).ToList();
        }

        public async Task<IReadOnlyList<UpcomingTask>> GetAllOrderedByDateAndNotcompleted()
        {
            return await _context.Tasks.Include(c => c.Comments)
                                        .Where(t => t.Completed != true)
                                        .GroupBy(t => t.DateToComplete.Date)
                                        .Select(g => new UpcomingTask
                                        {
                                            Date = g.Key,
                                            Tasks = g.OrderBy(d => d.DateToComplete).ToList()
                                        }).ToListAsync();
        }


        // this is fucked up, no groupping needed
        public async Task<IReadOnlyList<UpcomingTask>> GetAllOrderedByLabel()
        {
            return await _context.Tasks
                            .OrderBy(l => (int)l.Label)
                            .GroupBy(t => t.DateToComplete.Date)
                                        .Select(g => new UpcomingTask
                                        {
                                            Date = g.Key,
                                            Tasks = g.OrderBy(d => d.DateToComplete).ToList()
                                        }).ToListAsync();
        }

    }
}