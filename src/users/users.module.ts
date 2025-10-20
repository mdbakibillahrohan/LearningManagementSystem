import { Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { UsersLoginHistoryService } from './services/users-login-history/users-login-history.service';

@Module({
  providers: [UsersService, UsersLoginHistoryService],
  exports: [UsersService]
})
export class UsersModule {}
