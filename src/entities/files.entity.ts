import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { FileType } from "./file_type.entity";

@Entity('files')
export class File extends BaseEntity {

    @Column({
        type: 'int'
    })
    file_type_id!: number;
    @Column({
        type: 'varchar',
        length: 400,
        nullable: false,
        unique: true,
    })
    file_name!: string;
    @Column({
        type: 'varchar',
        length: 128,
        nullable: false,
    })
    file_unique_number!: string;
    @Column({
        type: 'varchar',
        length: 400,
        nullable: false,
        unique: true,
    })
    file_path!: string;
    @Column({
        type: 'varchar',
        length: 10,
        nullable: false,
    })
    file_extension!: string;
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    remarks!: string;

    @ManyToOne(type => FileType)
    @JoinColumn({ name: 'file_type_id' })
    fileType!: FileType;
}