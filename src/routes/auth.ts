import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import { validate, isEmpty } from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        //validar datos
        let errors: any = {}
        const emailUser = await User.findOne({ email })
        const usernameUser = await User.findOne({ username })

        if(emailUser) {
            errors.email = 'Esta dirección de e-mail ya ha sido utilizada'
        }
        if(usernameUser) {
            errors.username = 'Este nombre de usuario ya ha sido utilizado'
        }

        if(Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        //crear usuario
        const user = new User({ email, username, password })

        errors = await validate(user);
        if(errors.length > 0) {
            return res.status(400).json({ errors })
        }

        await user.save();;
        //devuelve usuario
        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)        
    }
}

const login = async (req: Request, res: Response) => {
 const { username, password } = req.body;
 
 try {
    const errors: any = {}
    if(isEmpty(username)) errors.username = 'El campo usuario está vacio'
    if(isEmpty(password)) errors.password = 'El campo contraseña está vacio'
    if(Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

     const user = await User.findOne({ username })

     if(!user) return res.status(404).json({ error: 'Usuario no encontrado'})

     const passwordMatches = await bcrypt.compare(password, user.password)

     if(!passwordMatches){
         return res.status(401).json({ password: 'Contraseña incorrecta' })
     }

     const token = jwt.sign({ username }, process.env.JWT_SECRET)

     //guarda el token en una cookie
     res.set('Set-Cookie', cookie.serialize('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict',
         maxAge: 3600,
         path: '/'
     }))

     return res.json(token);
 } catch (err) {
     
 }
}

const me = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if(!token) throw new Error('Sin autentificar')

        const { username }:any = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({ username })

        if(!user) throw new Error('Sin autentificar')

        return res.json(user);
    } catch (err) {
        return res.status(401).json({error: err.message})
    }
}

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/me', me)

export default router