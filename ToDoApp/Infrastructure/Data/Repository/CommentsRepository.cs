using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repository
{
    public class CommentsRepository : GenericRepository<Comment>, 
                                      ICommentRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public CommentsRepository(DataContext context, IMapper mapper) 
            : base(context, mapper)
        {
                _mapper = mapper;
                _context = context;
        }

        public async Task<IReadOnlyList<Comment>> GetCommentsByTaskId(int taskId)
        {
            var comments = await _context.Comments.Where(t => t.TaskId == taskId).ToListAsync();

            return comments;
        }
    }
}