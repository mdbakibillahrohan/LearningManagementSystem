import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginHistory } from 'src/entities/user-login-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersLoginHistoryService {
    constructor(@InjectRepository(UserLoginHistory)
        private readonly userRepository: Repository<UserLoginHistory> ){
            
        }
    
    async createLoginHistory(userId:number){
        const userLoginHistory:UserLoginHistory = new UserLoginHistory();
        userLoginHistory.login_time = new Date();
    }
    
}
