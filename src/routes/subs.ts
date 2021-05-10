import { isEmpty } from 'class-validator';
import { NextFunction, Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import Post from '../entities/Post';
import Sub from '../entities/Sub';
import User from '../entities/User';
import auth from '../middleware/auth';
import user from '../middleware/user';
import multer, { FileFilterCallback } from 'multer';
import { makeId } from '../util/helpers';
import path from 'path';

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;

  const user: User = res.locals.user;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = 'El nombre no puede estar vacío';
    if (isEmpty(title)) errors.title = 'El título no puede estar vacío';

    const sub = await getRepository(Sub)
      .createQueryBuilder('sub')
      .where('lower(sub.name) = :name', { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = 'Este sub ya existe';

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (err) {
    return res.status(400).json(err);
  }

  try {
    const sub = new Sub({ name, description, title, user });
    await sub.save();

    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error inesperado' });
  }
};

const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const sub = await Sub.findOneOrFail({ name });
    const posts = await Post.find({
      where: { sub },
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes'],
    });

    sub.posts = posts;

    if(res.locals.user) {
        sub.posts.forEach(p => p.setUserVote(res.locals.user))
    }

    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ sub: 'Subcomunidad no encontrada' });
  }
};

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user

  try {
    const sub = await Sub.findOneOrFail({ where: { name: req.params.name }})

    if(sub.username !== user.username) {
      return res.status(403).json({ error: 'No eres el propietario de esta comunidad'})
    }

    res.locals.sub = sub
    return next()

  } catch (err) {
    return res.status(500).json({ error: 'Error inesperado' })
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/images',
    filename: (_, file, callback) => {
      const name = makeId(15)
      callback(null, name + path.extname(file.originalname)) //jdlksfjldsk + .jpg
    }
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      callback(null, true)
    } else {
      callback(new Error('Formato erróneo'))
    }
  }
})

const uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub
  try {
    const type = req.body.type

    if(type !== 'image' && type !== 'banner'){
      return res.status(400).json({ error: 'Formato erróneo' })
    }

    if(type === 'image') {
      sub.imageUrn = req.file.filename
    } else if(type === 'banner'){
      sub.bannerUrn = req.file.filename
    }
    await sub.save()

    return res.json(sub)
  } catch (err) {
    return res.status(500).json({ error: 'Error inesperado' })
  }
  return res.json({ success: true })
}

const router = Router();
router.post('/', user, auth, createSub);
router.get('/:name', user, getSub);
router.post('/:name/image', user, auth, ownSub, upload.single('file'), uploadSubImage)

export default router;
