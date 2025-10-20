import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity('genders')
export class Gender extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    gender_name!: string;
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    remarks!: string;
}