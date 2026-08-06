using AgileFlow.Application.DTOs;
using AgileFlow.Application.Ports;
using AgileFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgileFlow.Infrastructure.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly AgileFlowDbContext _context;

    public ReportRepository(AgileFlowDbContext context)
    {
        _context = context;
    }

    public async Task<ProjectReportDto?> GetProjectReportAsync(Guid projectId)
    {
        var project = await _context.Projects
            .Include(p => p.Columns)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null) return null;

        var tasks = await _context.Tasks
            .Include(t => t.Assignee)
            .Include(t => t.Column)
            .Where(t => t.Column.ProjectId == projectId)
            .OrderBy(t => t.Column.Order)
            .ThenBy(t => t.Order)
            .ToListAsync();

        return new ProjectReportDto
        {
            ProjectName = project.Name,
            Description = project.Description,
            Status = project.Status,
            StartDate = project.StartDate,
            EndDate = project.EndDate,
            GeneratedAt = DateTime.UtcNow,
            Tasks = tasks.Select(t => new ReportTaskDto
            {
                Title = t.Title,
                Description = t.Description,
                Column = t.Column.Name,
                Priority = t.Priority,
                Assignee = t.Assignee?.Name ?? "Sin asignar",
                CreatedAt = t.CreatedAt
            }).ToList()
        };
    }
}