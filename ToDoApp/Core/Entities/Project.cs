
namespace Core.Entities {
public class Project : BaseEntity {
    public string Name { get; set; }
    public string Description { get; set; }
    public bool Completed { get; set; }
    public ICollection<Core.Entities.Task> Tasks { get; set; }

}
}