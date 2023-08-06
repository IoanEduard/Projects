using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using ToDoAPI.DTO;

namespace ToDoAPI.Controllers
{
    public class CommentController : RootController
    {
        public readonly IMapper _mapper;
        public readonly IUnitOfWork _unitOfWork;

        public CommentController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpPost("addOrUpdate")]
        public async Task<IActionResult> AddComment(CommentDto commentDto)
        {
            var commentInDatabase = await _unitOfWork.CommentRepository.GetByIdAsync(commentDto.Id);

            if (commentInDatabase == null)
            {
                var comment = _mapper.Map<CommentDto, Comment>(commentDto);
                _unitOfWork.CommentRepository.AddAsync(comment);

                if (await _unitOfWork.Complete())
                {

                    return CreatedAtAction(
                        nameof(GetCommentById),
                        new { id = comment.Id },
                        new CommentDto
                        {
                            Id = comment.Id,
                            CommentText = comment.CommentText,
                            TaskId = comment.TaskId
                        });
                }
            }
            else
            {
                commentInDatabase.CommentText = commentDto.CommentText;

                _unitOfWork.CommentRepository.Update(commentInDatabase);

                if (await _unitOfWork.Complete()) return NoContent();

                return BadRequest("Couldn't update your comment");
            }

            return BadRequest("Couldn't save your comment");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCommentById(int id)
        {
            var comment = await _unitOfWork.CommentRepository.GetByIdAsync(id);

            return Ok(_mapper.Map<CommentDto>(comment));
        }

        [HttpGet("getCommentsByTaskId/{taskId}")]
        public async Task<IActionResult> GetCommentsByTaskId(int taskId)
        {
            var comments = await _unitOfWork.CommentRepository.GetCommentsByTaskId(taskId);

            return Ok(_mapper.Map<IEnumerable<CommentDto>>(comments));
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var comment = await _unitOfWork.CommentRepository.GetByIdAsync(commentId);

            if (comment == null) return NotFound();

            _unitOfWork.CommentRepository.DeleteAsync(comment);

            if (await _unitOfWork.Complete()) return NoContent();

            return BadRequest("Couldn't delete comment");
        }
    }
}