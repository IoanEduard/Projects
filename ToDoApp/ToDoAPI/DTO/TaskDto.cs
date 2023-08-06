using System.ComponentModel.DataAnnotations;

namespace ToDoAPI.DTO
{
    public class TaskDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [DateIsInTheFuture]
        public DateTime DateToComplete { get; set; }
        public ICollection<CommentDto> Comments { get; set; }
        [Required]
        public Label Label { get; set; }
        public bool Completed { get; set; }
        public bool Inactive { get; set; }
        public bool Trash { get; set; }
    }
}
