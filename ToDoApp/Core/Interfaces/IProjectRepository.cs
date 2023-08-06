
using Core.Entities;
using Core.Interfaces.Repository;

namespace Core.Interfaces
{
    public interface IProjectRepository : IGenericRepository<Project>
    {
        Task<Project> GetProjectWithTasks(int id);
        Task<IReadOnlyList<Project>> SearchProjectByName(string searchText);
    }
}