namespace Core.Entities
{
    public class Comment : BaseEntity
    {
        public string CommentText { get; set; }
        public Core.Entities.Task Task { get; set; }
        public int TaskId { get; set; }
    }
}
 
