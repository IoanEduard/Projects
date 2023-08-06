using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class Task : BaseEntity
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [DateIsInTheFuture]
        public DateTime DateToComplete { get; set; }

        [Required]
        public Label Label { get; set; }
        public bool Completed { get; set; }
        public bool Inactive { get; set; }
        public bool Trash { get; set; }
        public ICollection<Comment> Comments { get; set; }

        public Project Project { get; set; }
        public int? ProjectId { get; set; }
        public ICollection<User> Users { get; set; }
    }
}
