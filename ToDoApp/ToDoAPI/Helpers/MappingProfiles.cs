using AutoMapper;
using Core.Entities;
using ToDoAPI.DTO;

namespace ToDoAPI.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<TaskDto, Core.Entities.Task>();
            CreateMap<Core.Entities.Task, TaskDto>();
            CreateMap<Comment, CommentDto>();
            CreateMap<CommentDto, Comment>()
                .ForMember(c => c.CommentText, o => o.MapFrom(x => x.CommentText))
                .ForMember(c => c.TaskId, o => o.MapFrom(x => x.TaskId));
            CreateMap<Project, ProjectDto>();
            CreateMap<ProjectDto, Project>();
            CreateMap<UpcomingTask, UpcomingTaskDto>();
            CreateMap<UpcomingTaskDto, UpcomingTask>();

            CreateMap<Project, ProjectSearchDto>();
            CreateMap<Project, BasicResponse>();

            CreateMap<Core.Entities.Task, TasksSearchDto>();
            CreateMap<Core.Entities.Task, BasicResponse>();

            CreateMap<User, UserBasicResponse>()
                .ForMember(c => c.Name, o => o.MapFrom(x => x.UserName));

            CreateMap<UserBasicResponse, User>()
                .ForMember(c => c.UserName, o => o.MapFrom(x => x.Name));


            // CreateMap<List<User>, List<BasicResponse>>();
            // CreateMap<List<BasicResponse>, List<User>>();
        }
    }
}