using Celluloid.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Celluloid", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<CelluloidDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<CelluloidCodeService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer",
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            Description = "Enter: Bearer {your JWT token}"
        });

    options.AddSecurityRequirement(
        new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Reference = new Microsoft.OpenApi.Models.OpenApiReference
                    {
                        Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
}
);

var app = builder.Build();

app.UseCors("Celluloid");

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapPost("/api/auth/register", async (
    string personalCode,
    CelluloidCodeService codeService,
    CelluloidDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(personalCode) ||
        personalCode.Length > 6 ||
        !personalCode.All(char.IsLetterOrDigit))
    {
        return Results.BadRequest("Code must be 1-6 letters or numbers.");
    }

    var fullCode = await codeService.GenerateCodeAsync(personalCode);

    db.Users.Add(new User
    {
        CelluloidCode = fullCode
    });

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        celluloidCode = fullCode
    });
});

app.MapPost("/api/auth/login", async (
    LoginRequest request,
    CelluloidDbContext db,
    IConfiguration configuration) =>
{
    var user = await db.Users
        .FirstOrDefaultAsync(u => u.CelluloidCode == request.CelluloidCode);

    if (user == null)
    {
        return Results.Unauthorized();
    }

    var claims = new[]
    {
        new System.Security.Claims.Claim(
            System.Security.Claims.ClaimTypes.NameIdentifier,
            user.Id.ToString()
        ),
        new System.Security.Claims.Claim(
            System.Security.Claims.ClaimTypes.Name,
            user.CelluloidCode
        )
    };

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)
    );

    var credentials = new SigningCredentials(
        key,
        SecurityAlgorithms.HmacSha256
    );

    var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
        issuer: configuration["Jwt:Issuer"],
        audience: configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddDays(30),
        signingCredentials: credentials
    );

    return Results.Ok(new
    {
        token = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler()
            .WriteToken(token)
    });
});

app.MapGet("/api/auth/me", (HttpContext httpContext) =>
{
    return Results.Ok(new
    {
        userId = httpContext.User.FindFirst(
            System.Security.Claims.ClaimTypes.NameIdentifier
        )?.Value,

        celluloidCode = httpContext.User.FindFirst(
            System.Security.Claims.ClaimTypes.Name
        )?.Value
    });
})
.RequireAuthorization();

app.MapPost("/api/watched", async (
    WatchedMovie watchedMovie,
    HttpContext httpContext,
    CelluloidDbContext db) =>
{
    var userIdClaim = httpContext.User.FindFirst(
        System.Security.Claims.ClaimTypes.NameIdentifier
    );

    if (userIdClaim == null)
    {
        return Results.Unauthorized();
    }

    var userId = int.Parse(userIdClaim.Value);

    var alreadyWatched = await db.WatchedMovies.AnyAsync(
        w => w.UserId == userId &&
             w.MovieId == watchedMovie.MovieId
    );

    if (alreadyWatched)
    {
        return Results.Conflict("Movie is already marked as watched.");
    }

    var newWatchedMovie = new WatchedMovie
    {
        UserId = userId,
        MovieId = watchedMovie.MovieId
    };

    db.WatchedMovies.Add(newWatchedMovie);
    await db.SaveChangesAsync();

    return Results.Ok(newWatchedMovie);
})
.RequireAuthorization();

app.MapGet("/api/watched", async (
    HttpContext httpContext,
    CelluloidDbContext db) =>
{
    var userIdClaim = httpContext.User.FindFirst(
        System.Security.Claims.ClaimTypes.NameIdentifier
    );

    if (userIdClaim == null)
    {
        return Results.Unauthorized();
    }

    var userId = int.Parse(userIdClaim.Value);

    var watchedMovies = await db.WatchedMovies
        .Where(w => w.UserId == userId)
        .Select(w => new
        {
            w.MovieId,
            w.WatchedAt
        })
        .ToListAsync();

    return Results.Ok(watchedMovies);
})
.RequireAuthorization();

app.MapDelete("/api/watched/{movieId}", async (
    string movieId,
    HttpContext httpContext,
    CelluloidDbContext db) =>
{
    var userIdClaim = httpContext.User.FindFirst(
        System.Security.Claims.ClaimTypes.NameIdentifier
    );

    if (userIdClaim == null)
    {
        return Results.Unauthorized();
    }

    var userId = int.Parse(userIdClaim.Value);

    var watchedMovie = await db.WatchedMovies
        .FirstOrDefaultAsync(w =>
            w.UserId == userId &&
            w.MovieId == movieId
        );

    if (watchedMovie == null)
    {
        return Results.NotFound("Movie is not marked as watched.");
    }

    db.WatchedMovies.Remove(watchedMovie);
    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        message = "Movie removed from watched.",
        movieId
    });
})
.RequireAuthorization();

app.Run();