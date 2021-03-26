import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json())
app.use(morgan('dev'));

app.get('/', (req, res) => res.send('Hola mundo'));

app.listen(5000, async () => {
    console.log('Servidor en localhost:5000')

    try {
        await createConnection()
        console.log('Base de datos conectada')
    } catch (err) {
        console.log(err)
    }
})