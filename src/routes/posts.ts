import { Request, Response, Router } from "express";
import Post from "../entities/Post";
import auth from '../middleware/auth';

const createPost = async (req: Request, res: Response) => {
    const { title, body, sub } = req.body

    const user = res.locals.user

    if(title.trim() === '') return res.status(400).json({ title: 'Debes introducir un título'})

    try {
        //encontrar sub

        const post = new Post({ title, body, user, subName: sub})
        await post.save()

        return res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Error inesperado '})
    }
}

const router = Router()

router.post('/', auth, createPost)

export default router