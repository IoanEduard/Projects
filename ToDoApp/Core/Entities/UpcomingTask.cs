namespace Core.Entities
{
    public class UpcomingTask : BaseEntity
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
        public IReadOnlyList<Core.Entities.Task> Tasks { get; set; }
    }
}