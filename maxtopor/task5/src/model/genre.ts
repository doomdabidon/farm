import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("genres")
export class Genre {
    @PrimaryGeneratedColumn()
    id?: bigint
    @Column()
    name: string
}