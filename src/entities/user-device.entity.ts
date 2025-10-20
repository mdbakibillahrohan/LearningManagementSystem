import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity('user_devices')
export class UserDevice extends BaseEntity {
    @Column({
        type: 'int',
        nullable: false,
    })
    user_id!: number;
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    device_id!: string;
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    device_name!: string;
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    mac_address!: string;
    @Column({
        type: 'boolean',
        nullable: false
    })
    is_logged_in!: boolean;

    login_count!: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

}