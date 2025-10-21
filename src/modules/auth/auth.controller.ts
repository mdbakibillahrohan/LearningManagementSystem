import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';

class SignInRequest{
    username:string;
    password:string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInRequest) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
