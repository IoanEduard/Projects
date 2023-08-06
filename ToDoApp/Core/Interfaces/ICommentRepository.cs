using Core.Entities;
using Core.Interfaces.Repository;

namespace Core.Interfaces
{
    public interface ICommentRepository : IGenericRepository<Comment>
    {
        Task<IReadOnlyList<Comment>> GetCommentsByTaskId(int taskId);
    }
}