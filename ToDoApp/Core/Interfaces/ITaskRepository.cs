using Core.Entities;
using Core.Interfaces.Repository;

namespace Core.Interfaces
{
    public interface ITaskRepository : IGenericRepository<Core.Entities.Task>
    {
        Task<IEnumerable<Core.Entities.Task>> GetTasksWithComments();
        Task<Core.Entities.Task> GetTaskWithUsers(int taskId);
        Task<IEnumerable<Core.Entities.Task>> GetTaskByProjectIdAndPK(int projectId, int[] taskId);
        Task<IEnumerable<Core.Entities.Task>> GetTasksToDeleteByRangeIds(int[] taskId);
        Task<IEnumerable<Core.Entities.Task>> GetInactiveTasks(int projectId);
        Task<IEnumerable<Core.Entities.Task>> GetInactiveTasks();
        Task<IEnumerable<Core.Entities.Task>> GetTrashTasks();
        Task<IReadOnlyList<Core.Entities.Task>> SearchTasksByName(string searchText, int projectId);
        Task<IEnumerable<Core.Entities.Task>> GetTasksByRange(int[] taskId);

        Task<IReadOnlyList<UpcomingTask>> GetAllOrderedByDateAscending();
        Task<IReadOnlyList<UpcomingTask>> GetAllOrderedByDateDescending();
        Task<IReadOnlyList<UpcomingTask>> GetAllOrderedByLabel();
        Task<IReadOnlyList<UpcomingTask>> GetAllOrderedByDateAndNotcompleted();
    }
}