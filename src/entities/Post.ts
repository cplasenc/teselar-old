import {Entity as TypeORMEntity, Column, Index, BeforeInsert, ManyToOne, JoinColumn, OneToMany, AfterLoad} from "typeorm";

import Entity from './Entity'
import User from "./User";
import { makeId, slugify } from "../util/helpers";
import Sub from "./Sub";
import Comment from './Comment';
import { Exclude, Expose } from "class-transformer";
import Vote from "./Vote";

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

    @Column()
    username: string

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;

    @ManyToOne(() => Sub, (sub) => sub.posts)
    @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
    sub: Sub;

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[]

    @Exclude()
    @OneToMany(() => Vote, vote => vote.post)
    votes: Vote[]

    @Expose() get url(): string{
        return `/t/${this.subName}/${this.identifier}/${this.slug}`
    }

    /**
     * cuantos comentarios existen
     */
    @Expose() get commentCount(): number {
        return this.comments?.length
    }
    /**
     * devuelve los votos totales en un comentario
     * usuario1 vota 1 + usuario2 vota -1 = voteScore=0
     */
    @Expose() get voteScore(): number {
        return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0)
    }

    protected userVote: number
    setUserVote(user: User) {
        const index = this.votes?.findIndex(v => v.username === user.username)
        this.userVote = index > -1 ? this.votes[index].value : 0
    }

    /*protected url: string
    @AfterLoad()
    createFields() {
        this.url = `/t/${this.subName}/${this.identifier}/${this.slug}`
    }*/

    @BeforeInsert()
    makeIdAndSlug(){
        this.identifier = makeId(7)
        this.slug = slugify(this.title)
    }
}