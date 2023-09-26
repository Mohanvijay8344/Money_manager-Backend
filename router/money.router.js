import express, { query } from "express";
import { client } from "../index.js";
import {
  getMoneybyID,
  createMoney,
  deleteMoney,
  updateMoney,
  getMoney,
} from "../service/money.service.js";
import {auth} from "../middleware/auth.js";

const router = express.Router();

// db.movies.find({})
router.get("/",auth, async function (request, response) {
  const money = await client
    .db("Money-Manger")
    .collection("money")
    .find({})
    .toArray();
  response.send(money);
});

router.get("/query", async function (request, response) {
  console.log(request.query);

  if(request.query.rating){
    request.query.rating = +request.query.rating
  }
  console.log(request.query);

  const movie = await getMoney(request.query);
  movie ? response.send(movie) : response.status(404).send("data Not Found");
});

// db.movies.findOne( {name: "Vikram"} )
router.get("/:id", async function (request, response) {
  const { id } = request.params;
  const movie = await getMoneybyID(id);
  movie ? response.send(movie) : response.status(404).send("data Not Found");
});


// db.movies.insertMany(data)
router.post("/", async function (request, response) {
  const data = request.body;
  const result = await createMoney(data);
  console.log(data);
  response.send(result);
});

// db.movies.deleteOne({name: "Ratatouille"})
router.delete("/:id", async function (request, response) {
  const { id } = request.params;
  const result = await deleteMoney(id);
  result.deletedCount >= 1
    ? response.send("Deleted Successfully")
    : response.status(404).send("data Not Found");
});

// db.movies.updateOne({name: "RRR"}, {$set: {language: "Tamil"}})
router.put("/:id", async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  const result = await updateMoney(id, data);
  response.send(result);
});

export default router;
