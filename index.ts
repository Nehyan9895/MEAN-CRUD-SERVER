import express from 'express';
import mongoose from "mongoose"
import cors from "cors"
import router from "./routes/route"
const app = express()
const port = 3000




mongoose.connect('mongodb://localhost:27017')


app.use('/uploads', express.static('uploads'));


app.use(express.json())
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());


app.use('/', router)


app.get('/', (req, res) => res.send('Hello World!'))



app.listen(port, () => console.log(`Example app listening on port ${port}!`))