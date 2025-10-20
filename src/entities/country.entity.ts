import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity('countries')
export class Country extends BaseEntity {
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    country_name!: string;
    @Column({
        type: 'varchar',
        length: 10,
        nullable: false,
        unique: true,
    })
    country_code!: string;
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    remarks!: string;

}