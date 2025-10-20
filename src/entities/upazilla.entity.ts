import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { District } from "./district.entity";

@Entity('upazillas')
export class Upazilla extends BaseEntity {
    @Column({
        type: 'int',
        nullable: false,
    })
    district_id!: number;
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    upazilla_name!: string;
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    remarks!: string;

    @ManyToOne(type => District)
    @JoinColumn({ name: 'district_id' })
    district!: District;
}