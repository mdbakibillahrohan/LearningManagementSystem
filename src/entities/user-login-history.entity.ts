import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity('user_login_histories')
export class UserLoginHistory extends BaseEntity {
    @Column({
        type: 'int',
        nullable: false,
    })
    user_id!: number;
    @Column({
        type: 'int',
        nullable: true,
    })
    device_id!: number;
    @Column({
        type: 'varchar',
        length: 1000,
        nullable: false,
        unique: true,
    })
    token!: string;
    @Column({
        type: 'timestamp',
        nullable: false,
        unique: true,
    })
    login_time!: Date;
    @Column({
        type: 'timestamp',
        nullable: true,
        unique: true,
    })
    logout_time!: Date;
    @Column({
        type: 'timestamp',
        nullable: true,
        unique: true,
    })
    expire_time!: Date;
    @Column({
        type: 'boolean',
        nullable: false,
        default: false
    })
    is_access_revoked!: boolean;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

}