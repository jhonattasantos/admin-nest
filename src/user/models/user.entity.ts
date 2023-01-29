import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users"})
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ unique: true})
    email: string;

    @Column()
    @Exclude()
    password: string;

}