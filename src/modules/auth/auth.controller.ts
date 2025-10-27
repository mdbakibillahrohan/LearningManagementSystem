import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './Dtos/regiser.dto';
import { SignInDto } from './Dtos/signin.dto';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  signIn(@Request() req:SignInDto) {
    return this.authService.login(req["user"])
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterDto,
  ): Promise<any> {
    return await this.authService.register(registerBody);
  }
}
