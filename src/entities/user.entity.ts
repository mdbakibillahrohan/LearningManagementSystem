import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserType } from "./user-type.entity";
import { Gender } from "./gender.entity";

@Entity('users')
export class User extends BaseEntity {
    @Column({
        type: 'int',
        nullable: false,
    })
    user_type_id!: number;
    @Column({
        type: 'int',
        nullable: false,
    })

    gender_id!: number;
    @Column()
    first_name!: string;
    @Column()
    last_name!: string;
    @Column()
    phone_number!: string;
    @Column({
        type: 'varchar',
        unique: true,
        length: 255,
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    email!: string;
    @Column({
        type: 'varchar',
        unique: true,
        length: 255,
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    username!: string;
    @Column({
        type: 'date',
        nullable: false,
    })
    date_of_birth!: Date;
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    password!: string;
    @Column({
        type: 'boolean',
        nullable: false,
        default: false
    })
    is_verified:boolean;

    @ManyToOne(type => UserType)
    @JoinColumn({ name: 'user_type_id' })
    user_type!: number;

    @ManyToOne(type => Gender)
    @JoinColumn({ name: 'gender_id' })
    gender!: Gender;
}