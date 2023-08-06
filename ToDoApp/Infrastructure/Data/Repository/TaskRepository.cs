using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repository
{
    public class TaskRepository : GenericRepository<Core.Entities.Task>,
                                  ITaskRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public TaskRepository(DataContext context, IMapper mapper) : base(context, mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Core.Entities.Task>> GetTaskByProjectIdAndPK(int projectId, int[] taskId)
        {
            var tasks = new List<Core.Entities.Task>();

            foreach (var id in taskId)
            {
                var task = await _context.Tasks.FirstOrDefaultAsync(x => x.ProjectId == projectId && x.Id == id);
                tasks.Add(task);
            }

            return tasks;
        }

        public async Task<IEnumerable<Core.Entities.Task>> GetTasksToDeleteByRangeIds(int[] taskId)
        {
            var tasks = new List<Core.Entities.Task>();

            foreach (var id in taskId)
            {
                var task = await _context.Tasks.FirstOrDefaultAsync(x => x.Id == id && x.Trash == true);
                if (task != null)
                    tasks.Add(task);
            }

            return tasks;
        }

        public async Task<IEnumerable<Core.Entities.Task>> GetTasksWithComments()
        {
            return await _context.Tasks
                             .Include(t => t.Comments)
                             .ToListAsync();
        }

        public async Task<Core.Entities.Task> GetTaskWithUsers(int taskId)
        {
            return await _context.Tasks
                             .Include(t => t.Users)
                             .FirstOrDefaultAsync(u => u.Id == taskId);
        }

        public async Task<IEnumerable<Core.Entities.Task>> GetInactiveTasks(int projectId)
        {
            return await _context.Tasks
                            .Where(t => t.Inactive == true && t.Trash == false && t.ProjectId == projectId)
                            .ToListAsync();
        }

        public async Task<IEnumerable<Core.Entities.Task>> GetInactiveTasks()
        {
            return await _context.Tasks
                            .Where(t => t.Inactive == true && t.Trash == false)
                            .ToListAsync();
        }

        public async Task<IEnumerable<Core.Entities.Task>> GetTrashTasks()
        {
            return await _context.Tasks
                            .Where(t => t.Trash == true)
                            .ToListAsync();
        }

        public async Task<IReadOnlyList<Core.Entities.Task>> SearchTasksByName(string searchText, int projectId)
        {
            return await _context.Tasks
                .Where(c => c.Name.Contains(searchText) && c.ProjectId != projectId)
                    .Select(p => p)
                    .ToListAsync();
        }

        public async Task<IEnumerable<Core.Entities.Task>> GetTasksByRange(int[] taskId)
        {
            var tasks = new List<Core.Entities.Task>();

            foreach (var id in taskId)
            {
                var task = await _context.Tasks.FirstOrDefaultAsync(x => x.Id == id);
                if (task != null)
                    tasks.Add(task);
            }

            return tasks;
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