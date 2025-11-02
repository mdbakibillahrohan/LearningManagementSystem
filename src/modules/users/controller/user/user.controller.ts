import { BadRequestException, Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { VerifyUserRequest } from '../../dto/user/verify-user-request.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@Controller('user')
export class UserController {
    constructor(
        private readonly usersService:UsersService
    ){

    }
    @Public()
    @Post("verify")
    async verifyUser(@Body() request:VerifyUserRequest){
        const otpVerification = await this.usersService.verifyUser(request.username,request.otp)

        if(otpVerification){
            return {
                message: "Successfully verified your OTP"
            }
        }

        throw new BadRequestException("Your OTP has not matched")
    }

    
}
