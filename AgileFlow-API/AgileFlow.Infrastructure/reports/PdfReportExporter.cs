using AgileFlow.Application.DTOs;
using AgileFlow.Application.Ports;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace AgileFlow.Infrastructure.Reports;

public class PdfReportExporter : IReportExporter
{
    public string Format => "pdf";

    public byte[] Export(ProjectReportDto report)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().Column(col =>
                {
                    col.Item().Text(report.ProjectName).FontSize(20).Bold();
                    col.Item().Text(report.Description).FontSize(11).FontColor(Colors.Grey.Medium);
                    col.Item().PaddingTop(4).Row(row =>
                    {
                        row.RelativeItem().Text($"Estado: {report.Status}");
                        row.RelativeItem().Text($"Inicio: {report.StartDate:dd/MM/yyyy}");
                        row.RelativeItem().Text($"Fin: {report.EndDate:dd/MM/yyyy}");
                    });
                    col.Item().Text($"Generado: {report.GeneratedAt:dd/MM/yyyy HH:mm}").FontColor(Colors.Grey.Medium);
                    col.Item().PaddingTop(8).LineHorizontal(1).LineColor(Colors.Grey.Lighten3);
                });

                page.Content().PaddingTop(16).Table(table =>
                {
                    table.ColumnsDefinition(cols =>
                    {
                        cols.RelativeColumn(3);
                        cols.RelativeColumn(2);
                        cols.RelativeColumn(2);
                        cols.RelativeColumn(1);
                    });

                    table.Header(header =>
                    {
                        header.Cell().Background(Colors.Blue.Lighten3).Padding(4).Text("Tarea").Bold();
                        header.Cell().Background(Colors.Blue.Lighten3).Padding(4).Text("Columna").Bold();
                        header.Cell().Background(Colors.Blue.Lighten3).Padding(4).Text("Responsable").Bold();
                        header.Cell().Background(Colors.Blue.Lighten3).Padding(4).Text("Prioridad").Bold();
                    });

                    foreach (var (task, i) in report.Tasks.Select((t, i) => (t, i)))
                    {
                        var bg = i % 2 == 0 ? Colors.White : Colors.Grey.Lighten5;
                        table.Cell().Background(bg).Padding(4).Text(task.Title);
                        table.Cell().Background(bg).Padding(4).Text(task.Column);
                        table.Cell().Background(bg).Padding(4).Text(task.Assignee);
                        table.Cell().Background(bg).Padding(4).Text(task.Priority);
                    }
                });

                page.Footer().AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Página ");
                        x.CurrentPageNumber();
                        x.Span(" de ");
                        x.TotalPages();
                    });
            });
        }).GeneratePdf();
    }
}