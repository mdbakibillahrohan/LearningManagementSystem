import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity('user_otp_histories')
export class UserOtpHistory extends BaseEntity {
    @Column({
        type: 'int',
        nullable: false,
    })
    user_id!: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: false,
    })
    otp!: number;

    @Column({
        type: 'timestamp',
        nullable: false,
    })
    expire_time!: Date;

    @Column({
        type: 'enum',
        enum: ['login', 'signup', 'forgot_password'],
    })
    otp_type!: 'login' | 'signup' | 'forgot_password';
    @Column({
        type: 'boolean',
        nullable: false,
    })
    is_verified!: boolean;
    @Column({
        type: 'boolean',
        nullable: false,
    })
    is_used!: boolean;
    @Column({
        type: 'boolean',
        nullable: false,
    })
    is_expired!: boolean;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}