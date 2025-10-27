import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users/users.service';
import bcrypt from 'bcrypt';
import { RegisterDto } from '../../Dtos/regiser.dto';
import dayjs from 'dayjs';
import { ActiveStatus } from 'src/entities/active-status.enum';
import { UserOtpHistoryService } from 'src/modules/users/services/user-otp-history/user-otp-history.service';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userOtpHistoryService: UserOtpHistoryService,
    private readonly dataSource: DataSource, // Inject DataSource
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByUsernameOrEmail(username);
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

  // REGISTER WITH TRANSACTION
  async register(user: RegisterDto): Promise<any> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let newUser: User;

    try {
      // 1. Check if user exists (in transaction)
      const existingUser = await queryRunner.manager.findOne(User, {
        where: [
          { username: user.username },
          { email: user.email },
        ],
      });

      if (existingUser) {
        throw new BadRequestException('Email or Username already exists');
      }

      // 2. Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // 3. Create user object
      const userData: Partial<User> = {
        first_name: user.first_name,
        last_name: user.last_name!,
        date_of_birth: dayjs(user.date_of_birth).toDate(),
        email: user.email,
        username: user.username,
        gender_id: user.gender_id,
        phone_number: user.phone_number!,
        active_status: ActiveStatus.ACTIVE,
        user_type_id: user.user_type_id!,
        password: hashedPassword,
      };

      // 4. Save user in transaction
      newUser = await this.usersService.createUser(userData, queryRunner);

      // 5. Generate OTP in same transaction
      await this.userOtpHistoryService.generateUserOtp(
        newUser.id,
        'signup',
        queryRunner,
      );

      // 6. Commit
      await queryRunner.commitTransaction();

      // 7. Return JWT
      return this.login(newUser);
    } catch (error) {
      // Rollback on any error
      await queryRunner.rollbackTransaction();
      throw error; // rethrow
    } finally {
      // Always release
      await queryRunner.release();
    }
  }
}