using API.Errors;
using Infrastructure.DAL;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("errors/{code}")]
[ApiExplorerSettings(IgnoreApi = true)]
public class ErrorController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public ErrorController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Error(int code)
    {
        return new ObjectResult(new ApiResponse(code));
    }
}