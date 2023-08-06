using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Interfaces;
using Core.Interfaces.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ToDoAPI.DTO;
using ToDoAPI.Services;

namespace ToDoAPI.Controllers
{
    public class AuthController : RootController
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public readonly ITokenService _tokenService;
        public AuthController(IAuthRepository authRepository, IConfiguration config, IMapper mapper, IUnitOfWork unitOfWork, ITokenService tokenService)
        {
            this._tokenService = tokenService;
            this._authRepository = authRepository;
            this._config = config;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            // validate request

            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            if (await _authRepository.UserExists(userForRegisterDto.Username))
                return BadRequest("Username already exists");

            var userRole = new UserRole();
            userRole.Role = new Role {
                Name = "Member"
            };

            var newUser = new User
            {
                UserName = userForRegisterDto.Username,
                Email = userForRegisterDto.Email,
                UserRoles = new List<UserRole>() { userRole }
            };

            var createdUser = await _authRepository.Register(newUser, userForRegisterDto.Password);

            var token = _tokenService.CreateToken(createdUser);

            return CreatedAtAction(
                    nameof(Register),
                    new { userId = createdUser.Id },
                    new 
                    {
                        token = token
                    });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var user = await _authRepository.Login(userForLoginDto.Username, userForLoginDto.Password);

            if (user == null)
                return Unauthorized();

            return Ok(new
            {
                token = _tokenService.CreateToken(user)
            });
        }

        [HttpGet("searchUser")]
        public async Task<IActionResult> SearchUserByName(string userName)
        {
            var usernamesResponse = await _unitOfWork.AuthRepository.SearchUserByName(userName);

            return Ok(new UserNamesResponse
            {
                Items = _mapper.Map<IReadOnlyList<UserBasicResponse>>(usernamesResponse)
            });
        }
    }
}
