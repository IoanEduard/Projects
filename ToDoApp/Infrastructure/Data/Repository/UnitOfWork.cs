using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Interfaces.Repository;

namespace Infrastructure.Data.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        public IAuthRepository AuthRepository { get; }
        public IProjectRepository ProjectRepository { get; }
        public ITaskRepository TaskRepository { get; }
        public ICommentRepository CommentRepository { get; }

        public UnitOfWork(DataContext context, IMapper mapper,
        ICommentRepository CommentRepository, ITaskRepository TaskRepository, IAuthRepository AuthRepository,
        IProjectRepository ProjectRepository)
        {
            _mapper = mapper;
            _context = context;
            this.AuthRepository = AuthRepository;
            this.ProjectRepository = ProjectRepository;
            this.TaskRepository = TaskRepository;
            this.CommentRepository = CommentRepository;
        }

        // public IAuthRepository AuthRepository => new AuthRepository(_context);

        // public IProjectRepository ProjectRepository => new ProjectRepository(_context, _mapper);

        // public ITaskRepository TaskRepository => new TaskRepository(_context, _mapper);
        // public ICommentRepository CommentRepository => new CommentsRepository(_context, _mapper);

        // public IUpcomingTasksRepository UpcomingTasksRepository => new UpcomingTasksRepository(_context, _mapper);

        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
        }
    }
}