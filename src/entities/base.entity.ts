import { Column, PrimaryGeneratedColumn } from "typeorm";
import { ActiveStatus } from "./active-status.enum";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @Column({ type: 'int' , nullable:true})
    created_by!: number;


    @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at!: Date | null;
    @Column({ type: 'int', nullable: true })
    updated_by!: number | null;
    @Column({ type: 'timestamp', nullable: true })
    deleted_at!: Date | null;
    @Column({ type: 'int', nullable: true })
    deleted_by!: number | null;
    @Column({
        type: "enum",
        enum: ActiveStatus,
        default: ActiveStatus.ACTIVE,
    })
    active_status!: ActiveStatus;
}   