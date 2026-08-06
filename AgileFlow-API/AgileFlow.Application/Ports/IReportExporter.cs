using AgileFlow.Application.DTOs;

namespace AgileFlow.Application.Ports;

public interface IReportExporter
{
    string Format { get; }
    byte[] Export(ProjectReportDto report);
}