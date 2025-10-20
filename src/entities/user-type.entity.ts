import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity('user_types')
export class UserType extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    type_name!: string;
    @Column({
        type: 'text',
        nullable: true,
    })
    description!: string;
}