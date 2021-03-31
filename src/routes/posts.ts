import { Request, Response, Router } from "express";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import auth from '../middleware/auth';

const createPost = async (req: Request, res: Response) => {
    const { title, body, sub } = req.body

    const user = res.locals.user

    if(title.trim() === '') return res.status(400).json({ title: 'Debes introducir un título'})

    try {
        //encontrar sub
        //error si intentas crear un post en un sub que no existe
        const subRecord = await Sub.findOneOrFail({ name: sub })

        const post = new Post({ title, body, user, sub: subRecord})
        await post.save()

        return res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Error inesperado '})
    }
}

const getPosts = async (_: Request, res: Response) => {
    try {
        const posts = await Post.find({
            //ordenador por fecha de creación
            order: { createdAt: 'DESC'}
        })

        return res.json(posts);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error inesperado al cargar posts'})
    }
}

const getPost = async (req: Request, res: Response) => {

    const { identifier, slug } = req.params

    try {
        const post = await Post.findOneOrFail({ identifier, slug }, {
            relations: ['sub'],
        })

        return res.json(post);
    } catch (err) {
        console.log(err);
        return res.status(404).json({ error: 'Post no encontrado'})
    }
}


const router = Router()

router.post('/', auth, createPost)
router.get('/', getPosts)
router.get('/:identifier/:slug', getPost)

export default router