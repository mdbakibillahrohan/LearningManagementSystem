import { Column,Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Institute } from "./institute.entity";


@Entity('user_institute_info')
export class UserInstituteInfo extends BaseEntity {
    @Column({
        type: 'int',
        nullable: false,
    })
    user_id!: number;
    @Column({
        type: 'int',
        nullable: false,
    })
    institute_id!: number;
    @Column({
        type: 'int',
        nullable: false,
    })
    institute_type_id!: number;

    @Column({
        type: 'date',
        nullable: false,
    })
    start_date!: Date;
    @Column({
        type: 'date',
        nullable: false,
    })
    end_date!: Date;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(type => Institute)
    @JoinColumn({ name: 'institute_id' })
    institute!: Institute;

}