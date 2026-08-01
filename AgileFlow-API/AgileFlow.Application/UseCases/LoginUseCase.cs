using AgileFlow.Application.DTOs;
using AgileFlow.Application.Ports;
using AgileFlow.Domain.Ports;

namespace AgileFlow.Application.UseCases;

public class LoginUseCase
{
    private readonly IAuthRepository _authRepository;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher _passwordHasher;

    public LoginUseCase(IAuthRepository authRepository, IJwtService jwtService, IPasswordHasher passwordHasher)
    {
        _authRepository = authRepository;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginResponse?> ExecuteAsync(LoginRequest request)
    {
        var user = await _authRepository.GetByEmailAsync(request.Email);
        if (user is null) return null;

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash)) return null;

        return new LoginResponse
        {
            Token = _jwtService.GenerateToken(user),
            Name = user.Name,
            Email = user.Email
        };
    }
}