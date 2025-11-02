import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, ILike, QueryRunner } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { ActiveStatus } from 'src/entities/active-status.enum';
import { UserOtpHistoryService } from '../user-otp-history/user-otp-history.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userOtpHistoryService: UserOtpHistoryService
  ) { }

  // ✅ FIXED: CREATE (Transaction-Ready)
  async createUser(userData: Partial<User>, queryRunner?: QueryRunner): Promise<User> {
    const manager = queryRunner ? queryRunner.manager : this.userRepository.manager;

    const user = manager.create(User, {  // Pass User class first
      ...userData,
      active_status: userData.active_status ?? ActiveStatus.ACTIVE,
    });

    return await manager.save(user);
  }

  // ✅ UPDATE: Transaction-Ready
  async updateUserById(
    userId: number,
    updateData: Partial<User>,
    updated_by: number,
    queryRunner?: QueryRunner,
  ): Promise<User> {
    const manager = queryRunner ? queryRunner.manager : this.userRepository.manager;

    // Find user in transaction context
    const user = await manager.findOne(User, {
      where: { id: userId, active_status: Not(ActiveStatus.DELETED) },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update only provided fields
    Object.assign(user, {
      ...updateData,
      updated_at: new Date(),
      updated_by,
    });

    return await manager.save(user);
  }

  // ✅ SOFT DELETE: Transaction-Ready
  async softDeleteUser(
    id: number,
    deleted_by: number,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const manager = queryRunner ? queryRunner.manager : this.userRepository.manager;

    const user = await manager.findOne(User, {
      where: { id, active_status: Not(ActiveStatus.DELETED) },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.active_status = ActiveStatus.DELETED;
    user.updated_at = new Date();
    user.updated_by = deleted_by;

    await manager.save(user);
  }

  // READ methods stay the same (no transaction needed)
  async userList(skip = 0, limit = 10, search_text: string | null = null): Promise<any> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search_text) {
      queryBuilder.where(
        'user.username ILIKE :search OR user.email ILIKE :search',
        { search: `%${search_text}%` },
      );
    }

    queryBuilder.andWhere('user.active_status != :deleted', {
      deleted: ActiveStatus.DELETED,
    });

    const [data, total] = await Promise.all([
      queryBuilder.orderBy('user.id', 'DESC').skip(skip).take(limit).getMany(),
      queryBuilder.getCount(),
    ]);

    return { data, total };
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
        active_status: Not(ActiveStatus.DELETED),
      },
      select: [
        'id', 'username', 'email', 'first_name', 'last_name',
        'date_of_birth', 'gender_id', 'active_status',
        'created_at', 'updated_at',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :identifier', { identifier })
      .orWhere('user.email = :identifier', { identifier })
      .andWhere('user.active_status != :deleted', { deleted: ActiveStatus.DELETED })
      .getOne();
  }

  async verifyUser(username: string, otp: string): Promise<boolean> {
    const user = await this.findUserByUsernameOrEmail(username);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    user.is_verified = true;
    await this.updateUserById(user.id, user, user.id);
    return await this.userOtpHistoryService.verifyUserOtp(user.id, "signup", otp)
  }

  // Other methods remain unchanged...
}