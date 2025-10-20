import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity('standards')
export class Standard extends BaseEntity {

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    standard_name!: string;
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    remarks!: string;
}