import { IsEmail, Min } from "class-validator";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity('users')
export class User extends BaseEntity {
    constructor(user: Partial<User>){
        super()
        Object.assign(this, user)
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @IsEmail()
    @Column({ unique: true })
    email: string

    @Index()
    @Min(3, { message: 'El usuario debe tener al menos 3 caracteres' })
    @Column({ unique: true })
    username: string

    @Column()
    @Min(6)
    password: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
