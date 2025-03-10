import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id?: bigint
    @Column()
    name: string
    @Column()
    password: string
    @ManyToMany(() => Role)
    @JoinTable({
        name: "users_roles",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        }
    })
    roles: Role[]
}