namespace ToDoAPI.DTO
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string CommentText { get; set; }
        public int TaskId { get; set; }
    }
}
