import express, { application, json } from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"
import dayjs from 'dayjs'



dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());

let db;

app.listen(5000, () => {
    console.log("Servidor rodando na porta 5000")
});

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect().then(() => {
    db = mongoClient.db("api-my-wallet")
});