import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveStatus } from 'src/entities/active-status.enum';
import { User } from 'src/entities/user.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {

    }
    async createUser(user: User): Promise<User> {
        const createdUser = this.userRepository.create(user);
        this.userRepository.save(createdUser);
        return createdUser;
    }

    async userList(skip: number = 0, limit: number = 10, search_text: string | null = null): Promise<User[]> {
        const search = search_text ? `%${search_text}%` : '%%'; // handle null safely

        const query = `
                    SELECT * 
                    FROM users 
                    WHERE username ILIKE $1 OR email ILIKE $1 OR $1 IS NULL
                    ORDER BY id DESC
                    LIMIT $2 OFFSET $3
                `;

        return await this.userRepository.query(query, [search, limit, skip]);
    }

    async findUserById(id: number): Promise<User> {
        return await this.userRepository.findOneByOrFail({ id, active_status: Not(ActiveStatus.DELETED) });
    }

    async findUserByUserName(username:string):Promise<User>{
        return this.userRepository.findOneByOrFail({
            username,
            active_status: Not(ActiveStatus.DELETED)
        })
    }

    async updateUserById(user: User, userId: number, updated_by: number): Promise<User> {
        var foundUser = await this.findUserById(userId);

        if (foundUser) {
            foundUser.first_name = user.first_name;
            foundUser.last_name = user.last_name;
            foundUser.date_of_birth = user.date_of_birth;
            foundUser.email = user.email;
            foundUser.gender_id = user.gender_id;
            foundUser.updated_at = new Date();
            foundUser.updated_by = updated_by;
            return await this.userRepository.save(foundUser);

        }
        throw new NotFoundException();
    }

    async deleteUser(id: number, deleted_by: number) {
        const foundUser = await this.findUserById(id);
        if (foundUser) {
            foundUser.active_status = ActiveStatus.DELETED;
            await this.userRepository.save(foundUser);
        }
        throw new NotFoundException();
    }
}
