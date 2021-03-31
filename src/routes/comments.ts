import { Request, Response, Router } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import auth from "../middleware/auth";

//sin usar
const commentsOnPost = async (req: Request, res: Response) => {
    
    const { identifier, slug } = req.params
    const body = req.body.body

    try {
        const post = await Post.findOneOrFail({ identifier, slug })

        const comment = new Comment({
            body,
            user: res.locals.user,
            post,

        })

        await comment.save()

        return res.json(comment)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ error: 'Post no encontrado'})
    }
}

const router = Router()

router.post('/:identifier/:slug/comments', auth, commentsOnPost)

export default router