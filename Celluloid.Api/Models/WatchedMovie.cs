namespace Celluloid.Api.Models;

public class WatchedMovie
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string MovieId { get; set; } = string.Empty;

    public DateTime WatchedAt { get; set; } = DateTime.UtcNow;
}