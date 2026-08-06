using AgileFlow.Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgileFlow.Api.Controllers;

[ApiController]
[Route("api/projects/{projectId}/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly ReportUseCases _useCases;

    public ReportsController(ReportUseCases useCases)
    {
        _useCases = useCases;
    }

    [HttpGet("{format}")]
    public async Task<IActionResult> Generate(Guid projectId, string format)
    {
        var result = await _useCases.GenerateAsync(projectId, format);
        if (result is null) return NotFound();

        var (content, contentType, fileName) = result.Value;
        return File(content, contentType, fileName);
    }
}