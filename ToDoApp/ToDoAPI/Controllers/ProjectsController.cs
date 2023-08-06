using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using ToDoAPI.DTO;

namespace ToDoAPI.Controllers
{
    public class ProjectsController : RootController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public ProjectsController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _unitOfWork.ProjectRepository.GetAllAsync();

            var projectListDto = _mapper.Map<List<ProjectDto>>(projects);

            var inactiveTasks = await _unitOfWork.TaskRepository.GetInactiveTasks();
            var inactiveProject = new ProjectInactiveDto();
            inactiveProject.Tasks = _mapper.Map<IReadOnlyList<TaskDto>>(inactiveTasks);
            projectListDto.Add(inactiveProject);

            var trashTasks = await _unitOfWork.TaskRepository.GetTrashTasks();
            var trashProject = new ProjectTrashDto();
            trashProject.Tasks = _mapper.Map<IReadOnlyList<TaskDto>>(trashTasks);
            projectListDto.Add(trashProject);

            // tasks with no projects

            return Ok(projectListDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            var project = await _unitOfWork.ProjectRepository.GetProjectWithTasks(id);

            return Ok(_mapper.Map<ProjectDto>(project));
        }

        [HttpPut("{projectId}")]
        public async Task<IActionResult> UpdateProject(int projectId, ProjectDto projectDto)
        {
            var project = await _unitOfWork.ProjectRepository.GetByIdAsync(projectId);

            if (project == null) return NotFound();

            project.Name = projectDto.Name;
            project.Description = projectDto.Description;
            project.Completed = projectDto.Completed;

            foreach (var item in projectDto.Tasks)
            {
                if (item.Id == 0)
                {
                    var taskToAdd = _mapper.Map<Core.Entities.Task>(item);
                    taskToAdd.ProjectId = projectId;

                    // fucked up
                    _unitOfWork.TaskRepository.AddAsync(taskToAdd);
                }
                else
                {
                    // fucked up
                    var task = await _unitOfWork.TaskRepository.GetByIdAsync(item.Id);

                    task.Name = item.Name;
                    task.Completed = item.Completed;
                    // UTC BULLSHIT!!
                    task.DateToComplete = item.DateToComplete.AddDays(1);
                    task.Label = item.Label;
                    task.ProjectId = projectId;

                    // fucked up
                    _unitOfWork.TaskRepository.Update(task);
                }
            }

            _unitOfWork.ProjectRepository.Update(project);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Couldn't edit the project");
        }

        [HttpPut("completeProject/{projectId}/{completed}")]
        public async Task<IActionResult> CompleteProject(int projectId, bool completed)
        {
            var project = await _unitOfWork.ProjectRepository.GetByIdAsync(projectId);

            if (project == null) return NotFound();

            project.Completed = completed;

            _unitOfWork.ProjectRepository.Update(project);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Couldn't mark your project as complete");
        }

        [HttpDelete("{projectId}")]
        public async Task<IActionResult> DeleteProject(int projectId)
        {
            var project = await _unitOfWork.ProjectRepository.GetByIdAsync(projectId);

            if (project == null) return NotFound();

            _unitOfWork.ProjectRepository.DeleteAsync(project);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Couldn't delete your project");
        }

        [HttpPost]
        public async Task<IActionResult> AddProject(ProjectDto projectDto)
        {
            var project = _mapper.Map<Project>(projectDto);

            _unitOfWork.ProjectRepository.AddAsync(project);

            if (await _unitOfWork.Complete())
                return CreatedAtAction(
                    nameof(GetProjectById),
                    new { id = project.Id },
                    new ProjectDto
                    {
                        Id = project.Id,
                        Name = project.Name,
                        Description = project.Description,
                        Completed = project.Completed,
                        Tasks = _mapper.Map<IReadOnlyList<TaskDto>>(project.Tasks)
                    }
                );

            return BadRequest("Couldn't add your project");
        }

        [HttpGet("searchProject")]
        public async Task<IActionResult> SearchProjectByName(string searchText)
        {
            var projectDtos = await _unitOfWork.ProjectRepository.SearchProjectByName(searchText);

            return Ok(new ProjectSearchDto
            {
                Items = _mapper.Map<IReadOnlyList<BasicResponse>>(projectDtos)
            });
        }
    }
}