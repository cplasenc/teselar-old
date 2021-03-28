import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import { validate } from 'class-validator';

const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        //TODO: validar datos

        //TODO: crear usuario
        const user = new User({ email, username, password })

        const errors = await validate(user);
        if(errors.length > 0) {
            return res.status(400).json({ errors })
        }

        await user.save();;
        //return usuario
        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)        
    }
}

const router = Router()
router.post('/register', register)

export default router