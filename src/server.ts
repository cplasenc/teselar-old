import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import trim from './middleware/trim';
import dotenv = require('dotenv');
import cookieParser = require("cookie-parser");

//carga variables de entorno para configuración
dotenv.config({path: 'config/dev.env'});

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());

app.get('/', (req, res) => res.send('Hola mundo'));
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

app.listen(PORT, async () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`)

    try {
        await createConnection()
        console.log('Conexión establecida con la base de datos')
    } catch (err) {
        console.log(err)
    }
})