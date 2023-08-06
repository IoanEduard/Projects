namespace ToDoAPI.DTO
{
    public class GroupedTaskByDateDto
    {
        public DateTime Date { get; set; }
        public IReadOnlyList<Core.Entities.Task> Tasks { get; set; }
    }
}