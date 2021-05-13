import {Entity as TypeORMEntity, Column, Index, ManyToOne, JoinColumn, OneToMany} from "typeorm";

import Entity from './Entity'
import User from "./User";
//import { makeId, slugify } from "../util/helpers";
import Post from "./Post";
import { Expose } from "class-transformer";

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

    @Column()
    username: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username'})
    user: User

    @OneToMany(() => Post, post => post.sub)
    posts: Post[]

    @Expose()
    get bannerUrl(): string | undefined {
        return this.bannerUrn ? `${process.env.APP_URL}/images/"${this.bannerUrn}` : undefined
    }
}