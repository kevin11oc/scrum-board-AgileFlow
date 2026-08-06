using AgileFlow.Application.DTOs;
using AgileFlow.Application.Ports;
using ClosedXML.Excel;

namespace AgileFlow.Infrastructure.Reports;

public class ExcelReportExporter : IReportExporter
{
    public string Format => "excel";

    public byte[] Export(ProjectReportDto report)
    {
        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Reporte");

        // Header del proyecto
        ws.Cell(1, 1).Value = report.ProjectName;
        ws.Cell(1, 1).Style.Font.Bold = true;
        ws.Cell(1, 1).Style.Font.FontSize = 16;
        ws.Range(1, 1, 1, 4).Merge();

        ws.Cell(2, 1).Value = $"Descripción: {report.Description}";
        ws.Range(2, 1, 2, 4).Merge();

        ws.Cell(3, 1).Value = $"Estado: {report.Status}";
        ws.Cell(3, 2).Value = $"Inicio: {report.StartDate:dd/MM/yyyy}";
        ws.Cell(3, 3).Value = $"Fin: {report.EndDate:dd/MM/yyyy}";
        ws.Cell(3, 4).Value = $"Generado: {report.GeneratedAt:dd/MM/yyyy HH:mm}";

        // Encabezados de tabla
        var headers = new[] { "Tarea", "Columna", "Responsable", "Prioridad", "Fecha Creación" };
        for (int i = 0; i < headers.Length; i++)
        {
            var cell = ws.Cell(5, i + 1);
            cell.Value = headers[i];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.LightBlue;
            cell.Style.Border.BottomBorder = XLBorderStyleValues.Thin;
        }

        // Datos
        for (int i = 0; i < report.Tasks.Count; i++)
        {
            var task = report.Tasks[i];
            var row = 6 + i;
            ws.Cell(row, 1).Value = task.Title;
            ws.Cell(row, 2).Value = task.Column;
            ws.Cell(row, 3).Value = task.Assignee;
            ws.Cell(row, 4).Value = task.Priority;
            ws.Cell(row, 5).Value = task.CreatedAt.ToString("dd/MM/yyyy");

            if (i % 2 == 0)
            {
                ws.Range(row, 1, row, 5).Style.Fill.BackgroundColor = XLColor.LightGray;
            }
        }

        // Ajusta anchos
        ws.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}