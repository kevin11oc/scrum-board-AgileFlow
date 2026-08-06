using AgileFlow.Application.DTOs;

namespace AgileFlow.Application.Ports;

public interface IReportRepository
{
    Task<ProjectReportDto?> GetProjectReportAsync(Guid projectId);
}