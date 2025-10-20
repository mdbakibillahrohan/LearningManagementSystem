import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Standard } from "./standard.entity";

@Entity('books')
export class Book extends BaseEntity {

    @Column({
        type: 'int',
        nullable: false,
    })
    standard_id!: number;

    @ManyToOne(type => Standard)
    @JoinColumn({ name: 'standard_id' })
    standard!: Standard;
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    title!: string;
    @Column({
        type: 'varchar',
        length: 3000,
        nullable: true,
    })
    description!: string;
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
        unique: true,
    })
    book_unique_number!: string;
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    cover_image_path!: string;
    @Column({
        type: 'varchar',
        length: 10,
        nullable: true,
    })
    isbn!: string;

    @Column({
        type: 'varchar',
        length: 5,
        nullable: true,
    })
    year_of_publication!: string;

    remarks!: string;
}