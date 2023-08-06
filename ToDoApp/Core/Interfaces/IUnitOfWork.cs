using Core.Entities;
using Core.Interfaces.Repository;

namespace Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IAuthRepository AuthRepository { get; }
        IProjectRepository ProjectRepository { get; }
        ITaskRepository TaskRepository { get; }
        ICommentRepository CommentRepository { get; }
        // IUpcomingTasksRepository UpcomingTasksRepository { get; }
        Task<bool> Complete();
        // bool HasChanges();
    }
}