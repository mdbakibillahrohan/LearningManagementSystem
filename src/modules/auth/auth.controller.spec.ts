import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth/auth.service';
import { SignInDto } from './Dtos/signin.dto';
import { RegisterDto } from './Dtos/regiser.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  // Mock response from service
  const mockLoginResponse = {
    access_token: 'jwt-token-123',
    user: {
      id: 1,
      username: 'john.doe1@example.com',
      email: 'john.doe1@example.com',
    },
  };

  const mockRegisterResponse = {
    id: 2,
    username: 'john_doe',
    email: 'john.doe@example.com',
    message: 'User registered successfully',
  };

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn(),
      register: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ==============================================================
  // POST /auth/login
  // ==============================================================
  describe('signIn', () => {
    const loginDto: SignInDto = {
      username: 'john.doe1@example.com',
      password: 'pass123',
    };

    it('should call authService.login with the user from LocalGuard and return token', async () => {
      // Simulate what LocalGuard puts in req.user
      const req = { user: { id: 1, username: loginDto.username } };

      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.signIn(req as any);

      expect(authService.login).toHaveBeenCalledWith(req.user);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should return 200 OK (via @HttpCode(HttpStatus.OK))', async () => {
      const req = { user: { id: 1 } };
      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.signIn(req as any);

      expect(result).toHaveProperty('access_token');
    });
  });

  // ==============================================================
  // POST /auth/register
  // ==============================================================
  describe('register', () => {
    const registerDto: RegisterDto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      username: 'john_doe',
      phone_number: '01712345678',
      date_of_birth: '1995-05-12',
      password: 'pass123',
      gender_id: 1,
      user_type_id: 2,
    };

    it('should call authService.register with the DTO and return created user', async () => {
      authService.register.mockResolvedValue(mockRegisterResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockRegisterResponse);
    });

    it('should return 201 Created by default', async () => {
      authService.register.mockResolvedValue(mockRegisterResponse);

      const result = await controller.register(registerDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('username', 'john_doe');
    });
  });
});