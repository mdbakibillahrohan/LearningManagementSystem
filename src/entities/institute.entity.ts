import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { InstituteType } from "./institute-type.entity";
import { Upazilla } from "./upazilla.entity";

@Entity('institutes')
export class Institute extends BaseEntity {

    @Column({
        type: 'int',
        nullable: false,
    })
    institute_type_id!: number;

    @Column({
        type: 'int',
        nullable: false,
    })
    upazilla_id!: number;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    institute_name!: string;
    @Column({
        type: 'varchar',
        length: 20,
        nullable: false,
        unique: true,
    })
    institute_code!: string;
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    institute_address!: string;
    @Column({
        type: 'int',
        nullable: false,
    })
    rank!: number;

    @ManyToOne(type => InstituteType)
    @JoinColumn({ name: 'institute_type_id' })
    institute_type!: InstituteType;

    @ManyToOne(type => Upazilla)
    @JoinColumn({ name: 'upazilla_id' })
    upazilla!: Upazilla;
}