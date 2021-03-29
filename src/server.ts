import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import trim from './middleware/trim';
import dotenv = require('dotenv');
import cookieParser = require("cookie-parser");

//carga variables de entorno para configuración
dotenv.config({path: 'config/dev.env'});

const app = express();

app.use(express.json())
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());

app.get('/', (req, res) => res.send('Hola mundo'));
app.use('/api/auth', authRoutes)

app.listen(5000, async () => {
    console.log('Servidor en localhost:5000')

    try {
        await createConnection()
        console.log('Base de datos conectada')
    } catch (err) {
        console.log(err)
    }
})