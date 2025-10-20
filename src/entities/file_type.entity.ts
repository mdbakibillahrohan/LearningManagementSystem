import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity('file_types')
export class FileType extends BaseEntity {

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    file_type_name!: string;
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    remarks!: string;


}