using System.Collections.Generic;

namespace ToDoAPI.DTO
{
    public class ProjectSearchDto
    {
        public IReadOnlyList<BasicResponse> Items { get; set; }
    }

    public class BasicResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class TasksSearchDto
    {
        public IReadOnlyList<BasicResponse> Items { get; set; }
    }
}