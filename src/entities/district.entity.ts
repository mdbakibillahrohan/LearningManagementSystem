import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Country } from "./country.entity";

@Entity('districts')
export class District extends BaseEntity {
    @Column({
        type: 'int',
        nullable: false,
    })
    country_id!: number;
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    district_name!: string;
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    remarks!: string;

    @ManyToOne(type => Country)
    @JoinColumn({ name: 'country_id' })
    country!: Country;
}