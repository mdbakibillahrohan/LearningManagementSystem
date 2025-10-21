import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './modules/users/services/users/users.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly userService:UsersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/user/list")
  getUserList(){
    return this.userService.userList(0, 10, null);
  }
}
