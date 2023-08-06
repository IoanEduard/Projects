namespace ToDoAPI.DTO
{
    public class ProjectTrashDto : ProjectDto
    {
        public bool TrashIcon { get; set; }
        public bool NoEdit { get; set; } = true;

        public ProjectTrashDto()
        {
            Name = "Deleted Tasks";
            Description = "Here are the tasks deleted, here you can delete them forever";
            Completed = false;
            TrashIcon = true;
        }
    }
}