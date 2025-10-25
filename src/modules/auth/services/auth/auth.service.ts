import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users/users.service';
import bcrypt from "bcrypt";
import { RegisterDto } from '../../Dtos/regiser.dto';
import dayjs from 'dayjs';
import { ActiveStatus } from 'src/entities/active-status.enum';
import { SignInDto } from '../../Dtos/signin.dto';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService,) { }

    async validateUser(username: string, password: string): Promise<User> {
        const user = await this.usersService.findUserByUsername(username);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const isMatch: boolean = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Password does not match');
        }
        return user;
    }
    async login(signInData: SignInDto): Promise<any> {

        const user = await this.usersService.findUserByUsername(signInData.username);

        const payload = { email: user.email, id: user.id };
        return { access_token: this.jwtService.sign(payload) };
    }
    async register(user: RegisterDto): Promise<any> {
        const existingUser = await this.usersService.isUsernameTaken(user.username);
        if (existingUser) {
            throw new BadRequestException('email or Username already exists');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser: User = new User();
        newUser.first_name = user.first_name;
        newUser.last_name = user.last_name!;
        newUser.date_of_birth = dayjs(user.date_of_birth).toDate();
        newUser.email = user.email;
        newUser.username = user.username;
        newUser.gender_id = user.gender_id;
        newUser.phone_number = user.phone_number!;
        newUser.active_status = ActiveStatus.ACTIVE;
        newUser.user_type_id = user.user_type_id!;
        newUser.password = hashedPassword;
        await this.usersService.createUser(newUser);
        return this.login(newUser);
    }
}
