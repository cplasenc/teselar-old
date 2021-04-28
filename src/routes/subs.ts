import { isEmpty } from "class-validator";
import { Request, Response, Router } from "express";
import { getRepository } from "typeorm";
import Sub from "../entities/Sub";
import User from "../entities/User";
import auth from "../middleware/auth";
import user from '../middleware/user';


const createSub = async (req: Request, res: Response) => {
    const { name, title, description } = req.body

    const user: User = res.locals.user

    try {
        let errors: any = {}
        if(isEmpty(name)) errors.name = 'El nombre no puede estar vacío'
        if(isEmpty(title)) errors.title = 'El título no puede estar vacío'

        const sub = await getRepository(Sub).createQueryBuilder('sub').where('lower(sub.name) = :name', { name: name.toLowerCase()}).getOne()

        if(sub) errors.name = 'Este sub ya existe'

        if(Object.keys(errors).length > 0) {
            throw errors
        }

    } catch (err) {
        return res.status(400).json(err);
    }

    try {
        const sub = new Sub({name, description, title, user })
        await sub.save()

        return res.json(sub)
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Error inesperado'})
    }
}

const router = Router()
router.post('/', user, auth, createSub)

export default router