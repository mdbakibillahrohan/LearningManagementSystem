import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity('institute_types')
export class InstituteType extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    institute_type_name!: string;
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    remarks!: string;
}