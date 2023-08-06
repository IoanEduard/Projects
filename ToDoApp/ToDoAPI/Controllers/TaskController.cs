using System.Security.Claims;
using AutoMapper;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ToDoAPI.DTO;

namespace ToDoAPI.Controllers
{
    public class TaskController : RootController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TaskController(IMapper mapper, IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        /*
            Add task with userId
            Assign task to user
            Get tasks for logged in users and tasks assigned 
            Add future task requires being logged in
        */
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var tasks = await _unitOfWork.TaskRepository.GetTasksWithComments();

            var result = tasks.Where(t => t.Inactive == false && t.Trash == false)
                                .GroupBy(g => g.DateToComplete.Date)
                                .Select(r => new
                                {
                                    Date = r.Key,
                                    Count = r.Count(),
                                    Tasks = r.ToList()
                                });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _unitOfWork.TaskRepository.GetByIdAsync(id);

            return Ok(_mapper.Map<TaskDto>(task));
        }

        [HttpGet("inactiveTasks/{projectId}")]
        public async Task<IActionResult> GetInactiveTasks(int projectId)
        {
            var tasks = await _unitOfWork.TaskRepository.GetInactiveTasks(projectId);

            return Ok(_mapper.Map<TaskDto[]>(tasks));
        }

        [HttpPost("addOrUpdate")]
        public async Task<IActionResult> AddOrUpdate(TaskDto taskDto)
        {
            var taskInDatabase = await _unitOfWork.TaskRepository.GetByIdAsync(taskDto.Id);

            if (taskInDatabase == null)
            {
                var task = _mapper.Map<TaskDto, Core.Entities.Task>(taskDto);

                _unitOfWork.TaskRepository.AddAsync(task);

                if (await _unitOfWork.Complete())
                    return CreatedAtAction(
                        nameof(GetTaskById),
                        new { id = task.Id },
                        new TaskDto
                        {
                            Id = task.Id,
                            Name = task.Name,
                            DateToComplete = task.DateToComplete,
                            Label = task.Label,
                            Completed = task.Completed
                        });
            }
            else
            {
                taskInDatabase.Name = taskDto.Name;
                // utc date shit
                taskInDatabase.DateToComplete = taskDto.DateToComplete.AddDays(1);
                taskInDatabase.Label = taskDto.Label;
                taskInDatabase.Completed = taskDto.Completed;

                _unitOfWork.TaskRepository.Update(taskInDatabase);
                if (await _unitOfWork.Complete()) return NoContent();
            }

            return BadRequest("Nothing happened");
        }

        [HttpPost("markTaskAsCompleted")]
        public async Task<IActionResult> MarkTaskAsCompleted(TaskCompleteDto taskDto)
        {
            var taskInDatabase = await _unitOfWork.TaskRepository.GetByIdAsync(taskDto.Id);
            if (taskInDatabase == null) return BadRequest();

            taskInDatabase.Completed = taskDto.Completed;

            _unitOfWork.TaskRepository.Update(taskInDatabase);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Nothing happened");
        }

        [HttpPost("markTaskAsInactive")]
        public async Task<IActionResult> MarkTaskAsInactive(TaskInactiveDto taskDto)
        {
            var taskInDatabase = await _unitOfWork.TaskRepository.GetByIdAsync(taskDto.Id);
            if (taskInDatabase == null) return BadRequest();

            taskInDatabase.Inactive = taskDto.Inactive;

            _unitOfWork.TaskRepository.Update(taskInDatabase);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Nothing happened");
        }

        [HttpPost("moveTaskToTrash")]
        public async Task<IActionResult> MoveTaskToTrash(TaskTrashDto taskDto)
        {
            var taskInDatabase = await _unitOfWork.TaskRepository.GetByIdAsync(taskDto.Id);
            if (taskInDatabase == null) return BadRequest();

            taskInDatabase.ProjectId = null;
            taskInDatabase.Inactive = true;
            taskInDatabase.Trash = taskDto.Trash;

            _unitOfWork.TaskRepository.Update(taskInDatabase);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Nothing happened");
        }

        [HttpPost("addTaskToProject/{taskId}/{projectId}")]
        public async Task<IActionResult> AddTaskToProject(int taskId, int projectId)
        {
            var taskInDatabase = await _unitOfWork.TaskRepository.GetByIdAsync(taskId);
            var projectInDatabase = await _unitOfWork.ProjectRepository.GetByIdAsync(projectId);

            if (taskInDatabase == null || projectInDatabase == null) return NotFound();

            taskInDatabase.ProjectId = projectId;
            taskInDatabase.Inactive = false;
            taskInDatabase.Trash = false;

            projectInDatabase.Completed = false;

            _unitOfWork.TaskRepository.Update(taskInDatabase);

            if (await _unitOfWork.Complete()) return Ok(taskInDatabase);

            return BadRequest("Couldn't add task to project");
        }

        [HttpPost("addUserToTask/{taskId}/{userId}")]
        public async Task<IActionResult> AddUserToTask(int taskId, string userId)
        {
            var taskInDatabase = await _unitOfWork.TaskRepository.GetTaskWithUsers(taskId);

            var user = await _unitOfWork.AuthRepository.FindUser(userId);

            taskInDatabase.Users.Add(user);

            if (await _unitOfWork.Complete()) 
               return CreatedAtAction(
                        nameof(AddUserToTask),
                        new { id = taskInDatabase.Id },
                        new 
                        {
                            TaskId = taskInDatabase.Id,
                            UserId = user.Id
                        });

            return BadRequest("Couldn't add task to project");
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var taskInDatabase = await _unitOfWork.TaskRepository.GetByIdAsync(id);
            if (taskInDatabase != null)
            {
                _unitOfWork.TaskRepository.DeleteAsync(taskInDatabase);
                if (await _unitOfWork.Complete()) return NoContent();
            }

            return BadRequest("Task not deleted");
        }

        [HttpGet("getAllOrderedByDateAscending")]
        public async Task<IActionResult> GetAllOrderedByDateAscending()
        {
            var tasks = _mapper.Map<IReadOnlyList<UpcomingTaskDto>>(
                await _unitOfWork.TaskRepository.GetAllOrderedByDateAscending()
            );

            return Ok(tasks);
        }

        [HttpGet("getAllOrderedByDateDescending")]
        public async Task<IActionResult> GetAllOrderedByDateDescending()
        {
            var tasks = _mapper.Map<IReadOnlyList<UpcomingTaskDto>>(
                await _unitOfWork.TaskRepository.GetAllOrderedByDateDescending()
            );

            return Ok(tasks);
        }

        [HttpGet("getAllTasksOrderedByDateAndNotcompleted")]
        public async Task<IActionResult> GetAllTasksOrderedByDateAndNotcompleted()
        {
            var tasks = _mapper.Map<IReadOnlyList<TaskDto>>(
                await _unitOfWork.TaskRepository.GetAllOrderedByDateAndNotcompleted()
            );

            return Ok(tasks);
        }

        [HttpGet("getAllTasksOrderedByLabel")]
        public async Task<IActionResult> GetAllTasksOrderedByLabel()
        {
            var tasks = _mapper.Map<IReadOnlyList<TaskDto>>(
                await _unitOfWork.TaskRepository.GetAllOrderedByLabel()
            );

            return Ok(tasks);
        }

        // this do the actual delete
        // add a mehtod to remove from projecty the tasks
        [HttpDelete("deleteTasks")]
        public async Task<IActionResult> DeleteTasks(int[] taskIds)
        {
            if (taskIds.Count() < 1) return BadRequest("Nothing to remove");

            var tasks = await _unitOfWork.TaskRepository.GetTasksToDeleteByRangeIds(taskIds);

            _unitOfWork.TaskRepository.DeleteRange(tasks);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Tasks failed to get deleted");
        }

        [HttpPost("removeTasksFromProject/{projectId}")]
        public async Task<IActionResult> RemoveTasksFromProject(int projectId, int[] taskIds)
        {
            if (taskIds.Count() < 1) return BadRequest("Nothing to remove");

            // var project = await _unitOfWork.TaskRepository.GetByIdAsync(projectId);

            // if (project == null) return BadRequest("No project was found");

            var tasks = await _unitOfWork.TaskRepository.GetTaskByProjectIdAndPK(projectId, taskIds);

            // HERE IT WORKED LAST TIME, TEST A FEW MORE TIMES, THEN REVERSE SOME OF THE CHANGES TILL IT FULLY WORKS
            // SSTILL A PROBLEM HITTING ProjectsController Update method

            foreach (var id in taskIds)
            {
                var task = await _unitOfWork.TaskRepository.GetByIdAsync(id);

                task.ProjectId = null;
                task.Trash = true;
                task.Inactive = true;

                _unitOfWork.TaskRepository.Update(task);
            }

            if (await _unitOfWork.Complete()) return NoContent();

            return Ok(tasks);
        }

        // tidy this up
        [HttpPut("markTasksInactive/{projectId}")]
        public async Task<IActionResult> MarkTasksInactive(int projectId, int[] taskIds)
        {
            if (taskIds.Count() < 1) return BadRequest("Nothing to remove");

            var tasks = await _unitOfWork.TaskRepository.GetTasksByRange(taskIds);

            foreach (var task in tasks)
            {
                task.Inactive = true;

                _unitOfWork.TaskRepository.Update(task);
            }

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Tasks failed to get deleted");
        }

        [HttpGet("searchTasks")]
        public async Task<IActionResult> SearchTasksByName(string searchText, int projectId)
        {
            var tasksDtos = await _unitOfWork.TaskRepository.SearchTasksByName(searchText, projectId);

            return Ok(new TasksSearchDto
            {
                Items = _mapper.Map<IReadOnlyList<BasicResponse>>(tasksDtos)
            });
        }

    }
}