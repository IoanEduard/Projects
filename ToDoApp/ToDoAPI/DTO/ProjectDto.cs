namespace ToDoAPI.DTO
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Completed { get; set; }
        public IReadOnlyList<TaskDto> Tasks { get; set; }
    }
}
