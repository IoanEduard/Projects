using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repository
{
    public class ProjectRepository : GenericRepository<Project>,
                                     IProjectRepository
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        public ProjectRepository(DataContext context, IMapper mapper)
            : base(context, mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Project> GetProjectWithTasks(int id)
        {
            var test = await _context.Projects
                            .Include(t => t.Tasks.Where(c => c.Inactive != true && c.Trash != true))
                            .FirstOrDefaultAsync(p => p.Id == id);
            return test;
        }

        public async Task<IReadOnlyList<Project>> SearchProjectByName(string searchText)
        {
            return await _context.Projects
                    .Where(c => c.Name.Contains(searchText))
                    .Select(p => p)
                    .ToListAsync();
        }
    }
}