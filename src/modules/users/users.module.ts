import { Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { UsersLoginHistoryService } from './services/users-login-history/users-login-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserLoginHistory } from 'src/entities/user-login-history.entity';
import { UserOtpHistoryService } from './services/user-otp-history/user-otp-history.service';
import { UserOtpHistory } from 'src/entities/user-otp-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserLoginHistory, UserOtpHistory])],
  providers: [UsersService, UsersLoginHistoryService, UserOtpHistoryService],
  exports: [UsersService, UsersLoginHistoryService, UserOtpHistoryService]
})
export class UsersModule {}
