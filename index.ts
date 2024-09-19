import express from 'express';
import mongoose from "mongoose"
import cors from "cors"
import router from "./routes/route"
const app = express()
const port = 3000




mongoose.connect('mongodb+srv://muhammednehyan9895:I915et0f1j@cluster0.ybzp1dx.mongodb.net/Connect')


app.use('/uploads', express.static('uploads'));


app.use(express.json())
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());


app.use('/', router)


app.get('/', (req, res) => res.send('Hello World! Nice to meet you br0000.Im heree,where are you'))



app.listen(port, () => console.log(`Example app listening on port ${port}!`))