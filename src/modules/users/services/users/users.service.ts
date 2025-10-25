import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, ILike } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { ActiveStatus } from 'src/entities/active-status.enum';

// interface UserListResponse {
//   data: User[];
//   total: number;
// }

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // CREATE
  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create({
      ...userData,
      active_status: userData.active_status || ActiveStatus.ACTIVE,
    });
    return await this.userRepository.save(user);
  }

  // READ: List with search, pagination
  async userList(
    skip = 0,
    limit = 10,
    search_text: string | null = null,
  ): Promise<any> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Apply search if provided
    if (search_text) {
      queryBuilder.where(
        'user.username ILIKE :search OR user.email ILIKE :search',
        { search: `%${search_text}%` },
      );
    }

    // Exclude soft-deleted users
    queryBuilder.andWhere('user.active_status != :deleted', {
      deleted: ActiveStatus.DELETED,
    });

    // Execute both queries in parallel
    const [data, total] = await Promise.all([
      queryBuilder
        .orderBy('user.id', 'DESC')
        .skip(skip)
        .take(limit)
        .getMany(),
      queryBuilder.getCount(),
    ]);

    return { data, total };
  }

  // READ: Find by ID (active only)
  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: {
        id,
        active_status: Not(ActiveStatus.DELETED),
      },
      select: [
        'id',
        'username',
        'email',
        'first_name',
        'last_name',
        'date_of_birth',
        'gender_id',
        'active_status',
        'created_at',
        'updated_at',
      ],
    });
  }

  // READ: Find by username (active only)
  async findUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: {
        username,
        active_status: Not(ActiveStatus.DELETED),
      },
    });
  }

  // READ: Find by username (including deleted - for registration check)
  async findUserByUsernameWithDeleted(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        username,
      },
      withDeleted: false, // Change to true if using @DeleteDateColumn
    });
  }

  // UPDATE
  async updateUserById(
    userId: number,
    updateData: Partial<User>,
    updated_by: number,
  ): Promise<User> {
    const user = await this.findUserById(userId); // Throws 404 if not found or deleted

    // Update only provided fields
    Object.assign(user, {
      ...updateData,
      updated_at: new Date(),
      updated_by,
    });

    return await this.userRepository.save(user);
  }

  // SOFT DELETE
  async softDeleteUser(id: number, deleted_by: number): Promise<void> {
    const user = await this.findUserById(id);

    user.active_status = ActiveStatus.DELETED;
    user.updated_at = new Date();
    user.updated_by = deleted_by;

    await this.userRepository.save(user);
  }

  // HARD DELETE (use with caution)
  async hardDeleteUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    await this.userRepository.remove(user);
  }

  // UTILITY: Check if username exists (active or not)
  async isUsernameTaken(username: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: {
        username,
        active_status: Not(ActiveStatus.DELETED),
      },
    });
    return count > 0;
  }
}