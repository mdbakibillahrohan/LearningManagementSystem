import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from './services/jwt/jwt.service';
import { AuthService } from './services/auth/auth.service';

@Module({
  imports:[UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService]
})
export class AuthModule {}
