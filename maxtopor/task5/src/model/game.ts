import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Genre } from "./genre"
import { Publisher } from "./publisher"

@Entity("games")
export class Game {
    @PrimaryGeneratedColumn()
    id?: bigint
    @Column()
    name: string
    @ManyToMany(() => Genre, { cascade: ["insert"] })
    @JoinTable({
        name: "games_genres",
        joinColumn: {
            name: "game_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "genre_id",
            referencedColumnName: "id"
        }
    })
    genres: Genre[]
    @ManyToMany(() => Publisher, { cascade: ["insert"] })
    @JoinTable({
        name: "games_publishers",
        joinColumn: {
            name: "game_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "publisher_id",
            referencedColumnName: "id"
        }
    })
    publishers: Publisher[]
}