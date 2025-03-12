import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "./author";

@Entity("book")
export class Book {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    title: string
    @OneToOne(() => Author)
    @JoinColumn({ referencedColumnName: "id", name: "authorid" })
    author: Author
}