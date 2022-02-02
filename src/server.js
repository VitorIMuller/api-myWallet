import express, { application, json } from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"
import dayjs from 'dayjs'
import bcrypt from "bcrypt"



dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());

const userSignUpModel = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required()
})

let db;

app.listen(5000, () => {
    console.log("Servidor rodando na porta 5000")
});

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect().then(() => {
    db = mongoClient.db("api-my-wallet")
});

app.post('/signin', (req, res) => {
    const user = req.body
    res.send(200)

})

app.post('/signup', async (req, res) => {
    const user = req.body
    const passwordHash = bcrypt.hashSync(user.password, 10)



    await db.collection("users").insertOne({ ...user, password: passwordHash })



})

app.get("/users", async (req, res) => {
    const users = await db.collection("users").find({}).toArray()

    res.send(users)

})