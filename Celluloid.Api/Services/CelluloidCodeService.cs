using System.Security.Cryptography;
using Celluloid.Api.Models;
using Microsoft.EntityFrameworkCore;

public class CelluloidCodeService
{
    private readonly CelluloidDbContext _db;

    public CelluloidCodeService(CelluloidDbContext db)
    {
        _db = db;
    }

    public async Task<string> GenerateCodeAsync(string personalCode)
    {
        const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        while (true)
        {
            var randomPart = new string(
                Enumerable.Range(0, 4)
                    .Select(_ => chars[RandomNumberGenerator.GetInt32(chars.Length)])
                    .ToArray()
            );

            var fullCode = $"{randomPart}-{personalCode}";

            if (!await _db.Users.AnyAsync(u => u.CelluloidCode == fullCode))
            {
                return fullCode;
            }
        }
    }
}