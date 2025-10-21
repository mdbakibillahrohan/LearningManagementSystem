import { Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { UsersLoginHistoryService } from './services/users-login-history/users-login-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersLoginHistoryService],
  exports: [UsersService]
})
export class UsersModule {}
