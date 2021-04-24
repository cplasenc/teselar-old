//coleccion de rutas genéricas
import { Request, Response, Router } from 'express';
import Comment from '../entities/Comment';
import Post from '../entities/Post';
import User from '../entities/User';
import Vote from '../entities/Vote';
import auth from '../middleware/auth';

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  //Validar el valor del voto
  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({ value: 'El valor debe ser de -1, 0 o 1' });
  }

  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      //si hay identificador de comentario encuentra el voto por comentario
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      //o encuentra voto por post
      vote = await Vote.findOne({ user, post });
    }

    if (!vote && value === 0) {
      //si no hay voto y el valor=0 devuelve error
      return res.status(404).json({ error: 'Voto no encontrado' });
    } else if (!vote) {
      //si no hay voto, lo crea
      vote = new Vote({ user, value });
      if (comment) vote.comment = comment;
      else vote.post = post;
      await vote.save();
    } else if (value === 0) {
      //si el voto existe y valor=0, elimina el voto de la BBDD
      await vote.remove();
    } else if (vote.value !== value) {
      //si el voto y valor han cambiado, actualiza el voto
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ['comments', 'comments.votes', 'sub', 'votes'] }
    );

    post.setUserVote(user);
    post.comments.forEach((c) => c.setUserVote(user));

    return res.json(post);
  } catch (err) {
    return res.status(500).json({ error: 'Error inesperado' });
  }
};

const router = Router();
router.post('/vote', auth, vote);

export default router;
