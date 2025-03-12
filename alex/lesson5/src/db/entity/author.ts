import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("author")
export class Author {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
}