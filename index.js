import * as dotenv from 'dotenv'
dotenv.config();

import moneyRouter from './router/money.router.js';
import usersRouter from './router/users.router.js';

import express from "express"; // "type": "module"
import cors from "cors";
import bodyParser from "body-parser"
import bcrypt from "bcrypt"

const app = express();

import { MongoClient } from "mongodb";

// const PORT = 4000;
const PORT = process.env.PORT;


const MONGO_URL = process.env.MONGO_URL;

export const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏❤️💕");
});

app.use("/money", moneyRouter)
app.use("/users", usersRouter)

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  next();
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

