import { IsEmail, Length } from "class-validator";
import {Entity as TypeORMEntity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, BeforeInsert, ManyToOne, JoinColumn, In, OneToMany} from "typeorm";
import bcrypt from 'bcrypt'
import { Exclude } from "class-transformer";

import Entity from './Entity'
import User from "./User";
import { makeId, slugify } from "../util/helpers";
import Post from "./Post";

@TypeORMEntity('subs')
export default class Sub extends Entity {
    constructor(post: Partial<Sub>){
        super()
        Object.assign(this, post)
    }

    @Index()
    @Column({ unique: true })
    name: string

    @Column()
    title: string

    @Column({ type: 'text', nullable: true})
    description: string

    @Column({ nullable: true})
    imageUrn: string

    @Column({ nullable: true })
    bannerUrn: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username'})
    user: User

    @OneToMany(() => Post, post => post.sub)
    posts: Post[]
}