namespace ToDoAPI.DTO
{
    public class UpcomingTaskDto
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
        public IReadOnlyList<Core.Entities.Task> Tasks { get; set; }
    }
}