import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users/users.service';
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService,) { }

    async validateUser(username: string, password: string): Promise<User> {
        const user: User = await this.usersService.findUserByUserName(username);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const isMatch: boolean = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Password does not match');
        }
        return user;
    }
    async login(user: User): Promise<any> {
        const payload = { email: user.email, id: user.id };
        return { access_token: this.jwtService.sign(payload) };
    }
    async register(user: any): Promise<any> {
        const existingUser = await this.usersService.findUserByUserName(user.username);
        if (existingUser) {
            throw new BadRequestException('email or Username already exists');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser: User = { ...user, password: hashedPassword };
        await this.usersService.createUser(newUser);
        return this.login(newUser);
    }
}
