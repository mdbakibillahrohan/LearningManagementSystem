import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity('book_file_mappings')
export class BookFileMapping extends BaseEntity {

    @Column({
        type: 'int',
    })
    book_id!: number;

    @Column({
        type: 'int',
    })
    file_id!: number;

    @Column({
        type: 'int',
    })
    order_number!: number;

}