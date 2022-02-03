import express, { application, json } from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"
import dayjs from 'dayjs'
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"



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

app.post('/signin', async (req, res) => {
    const { email, password } = req.body

    const user = await db.collection("users").findOne({ email })

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = uuid();

        await db.collection("sessions").insertOne({
            userId: user._id,
            token
        })
        res.status(200).send(token)

    } else {
        res.status(401).send("Usuario não encontrado")
    }


})

app.post('/signup', async (req, res) => {
    const user = req.body
    try {
        const userDuplicated = await db.collection("users").findOne({ email: user.email })

        if (userDuplicated) {
            res.sendStatus(409)
        } else {

            const passwordHash = bcrypt.hashSync(user.password, 10)
            await db.collection("users").insertOne({ ...user, password: passwordHash })
        }
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.get("/users", async (req, res) => {
    const users = await db.collection("users").find({}).toArray()

    res.send(users)

})