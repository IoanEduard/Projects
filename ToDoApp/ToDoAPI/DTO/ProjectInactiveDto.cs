namespace ToDoAPI.DTO
{
    public class ProjectInactiveDto : ProjectDto
    {
        public bool InactiveIcon { get; set; }
        public bool NoEdit { get; set; } = true;

        public ProjectInactiveDto()
        {
            Name = "Inactive Tasks";
            Description = "Here are the tasks without being assigned to a project or marked inactive";
            Completed = false;
            InactiveIcon = true;
        }
    }
}