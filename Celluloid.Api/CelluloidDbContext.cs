using Celluloid.Api.Models;
using Microsoft.EntityFrameworkCore;

public class CelluloidDbContext : DbContext
{
    public CelluloidDbContext(DbContextOptions<CelluloidDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<WatchedMovie> WatchedMovies { get; set; }
}