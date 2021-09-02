import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express';
import morgan from 'morgan';
import trim from './middleware/trim';
import dotenv = require('dotenv');
import cookieParser = require("cookie-parser");
import cors from 'cors';

import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import subRoutes from './routes/subs';
import miscRoutes from './routes/misc';
import userRouter from './routes/users';

//carga variables de entorno para configuración
dotenv.config({path: 'config/dev.env'});

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200
}));

app.use(express.static('public'))

app.get('/api', (_, res) => res.send('Test endpoint'));
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/subs', subRoutes)
app.use('/api/misc', miscRoutes)
app.use('/api/users', userRouter)

app.listen(PORT, async () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`)

    try {
        await createConnection()
        console.log('Conexión establecida con la base de datos')
    } catch (err) {
        console.log(err)
    }
})