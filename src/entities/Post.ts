import { IsEmail, Length } from "class-validator";
import {Entity as TypeORMEntity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, BeforeInsert, ManyToOne, JoinColumn} from "typeorm";
import bcrypt from 'bcrypt'
import { Exclude } from "class-transformer";

import Entity from './Entity'
import User from "./User";
import { makeId, slugify } from "../util/helpers";

@TypeORMEntity('posts')
export default class Post extends Entity {
    constructor(post: Partial<Post>){
        super()
        Object.assign(this, post)
    }

    @Index()
    @Column()
    identifier: string //caracteres id 

    @Column()
    title: string

    @Index()
    @Column()
    slug: string

    @Column({ nullable: true, type: 'text' })
    body: string

    @Column()
    subName: string

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    @BeforeInsert()
    makeIdAndSlug(){
        this.identifier = makeId(7)
        this.slug = slugify(this.title)
    }
}