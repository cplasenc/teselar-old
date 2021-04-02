import { IsEmail, Length } from "class-validator";
import {Entity as TypeORMEntity, Column, Index, BeforeInsert, OneToMany} from "typeorm";
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
    @IsEmail(undefined, {message: 'Debes introducir una dirección de correo correcta'})
    @Length(1, 255, { message: 'Introduce una dirección de e-mail'})
    @Column({ unique: true })
    email: string

    @Index()
    @Length(3, 255, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
    @Column({ unique: true })
    username: string

    @Exclude()
    @Length(6, 255, {message: 'La contraseña debe tener al menos 6 caracteres'})
    @Column()
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
