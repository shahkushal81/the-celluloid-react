namespace Celluloid.Api.Models;

public class User
{
    public int Id { get; set; }

    public string CelluloidCode { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}