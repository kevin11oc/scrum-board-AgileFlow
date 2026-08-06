using AgileFlow.Application.Ports;
namespace AgileFlow.Application.UseCases;

public class ReportUseCases
{
    private readonly IReportRepository _repository;
    private readonly IEnumerable<IReportExporter> _exporters;

    public ReportUseCases(IReportRepository repository, IEnumerable<IReportExporter> exporters)
    {
        _repository = repository;
        _exporters = exporters;
    }

    public async Task<(byte[] Content, string ContentType, string FileName)?> GenerateAsync(Guid projectId, string format)
    {
        var report = await _repository.GetProjectReportAsync(projectId);
        if (report is null) return null;

        var exporter = _exporters.FirstOrDefault(e => e.Format.Equals(format, StringComparison.OrdinalIgnoreCase));
        if (exporter is null) return null;

        var content = exporter.Export(report);
        var (contentType, extension) = format.ToLower() switch
        {
            "pdf" => ("application/pdf", "pdf"),
            "excel" => ("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"),
            _ => ("application/octet-stream", "bin")
        };

        return (content, contentType, $"{report.ProjectName}-report.{extension}");
    }
}