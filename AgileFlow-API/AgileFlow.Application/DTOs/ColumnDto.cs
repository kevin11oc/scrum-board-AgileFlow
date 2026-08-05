namespace AgileFlow.Application.DTOs;

public class ColumnDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }
    public Guid ProjectId { get; set; }
}

public class CreateColumnRequest
{
    public string Name { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
}

public class UpdateColumnRequest
{
    public string Name { get; set; } = string.Empty;
}

public class ReorderColumnsRequest
{
    public List<Guid> OrderedIds { get; set; } = new();
}