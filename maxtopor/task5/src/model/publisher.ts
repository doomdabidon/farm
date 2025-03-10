import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Game } from "./game"

@Entity("publishers")
export class Publisher {
    @PrimaryGeneratedColumn()
    id?: bigint
    @Column()
    name: string
    @ManyToMany(() => Game, (game) => game.publishers)
    games: Game[]
}