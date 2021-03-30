import { IsEmail, Length } from "class-validator";
import {Entity as TypeORMEntity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, BeforeInsert, OneToMany} from "typeorm";
import bcrypt from 'bcrypt'
import { Exclude } from "class-transformer";

import Entity from './Entity'
import Post from "./Post";

@TypeORMEntity('users')
export default class User extends Entity {
    constructor(user: Partial<User>){
        super()
        Object.assign(this, user)
    }

    /* Innecesario porque lo hereda de Entity
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;
    */

    @Index()
    @IsEmail()
    @Column({ unique: true })
    email: string

    @Index()
    @Length(3, 255, { message: 'El usuario debe tener al menos 3 caracteres' })
    @Column({ unique: true })
    username: string

    @Exclude()
    @Column()
    @Length(6, 255)
    password: string

    /*
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
    */

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6);
    }

    /*
    toJSON() {
        return classToPlain(this)
    }
    */
}
