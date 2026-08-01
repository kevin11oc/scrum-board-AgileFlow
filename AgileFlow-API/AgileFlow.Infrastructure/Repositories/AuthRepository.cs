using AgileFlow.Domain.Entities;
using AgileFlow.Domain.Ports;
using AgileFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgileFlow.Infrastructure.Repositories;

public class AuthRepository : IAuthRepository
{
    private readonly AgileFlowDbContext _context;

    public AuthRepository(AgileFlowDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }
}