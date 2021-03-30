import { PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert} from "typeorm";
import { classToPlain, Exclude } from "class-transformer";

/**
 * Campos genéricos para que hereden el resto de Modelos
 */
export default abstract class Entity extends BaseEntity {

    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    toJSON() {
        return classToPlain(this)
    }
}
