import express, { query } from "express";
import { client } from "../index.js";
import {
  getNotesbyID,
  createNotes,
  deleteNotes,
  updateNotes,
  getNotes,
} from "../service/notes.service.js";
import {auth} from "../middleware/auth.js";

const router = express.Router();

// db.movies.find({})
router.get("/", async function (request, response) {
  const notes = await client
    .db("Notes_Taking")
    .collection("Notes")
    .find({})
    .toArray();
  response.send(notes);
});

router.get("/query", async function (request, response) {
  console.log(request.query);

  if(request.query.rating){
    request.query.rating = +request.query.rating
  }
  console.log(request.query);

  const notes = await getNotes(request.query);
  notes ? response.send(notes) : response.status(404).send("data Not Found");
});

// db.movies.findOne( {name: "Vikram"} )
router.get("/:id", async function (request, response) {
  const { id } = request.params;
  const notes = await getNotesbyID(id);
  notes ? response.send(notes) : response.status(404).send("data Not Found");
});


// db.movies.insertMany(data)
router.post("/", async function (request, response) {
  const data = request.body;
  const result = await createNotes(data);
  console.log(data);
  response.send(result);
});

// db.movies.deleteOne({name: "Ratatouille"})
router.delete("/:id", async function (request, response) {
  const { id } = request.params;
  const result = await deleteNotes(id);
  result.deletedCount >= 1
    ? response.send("Deleted Successfully")
    : response.status(404).send("data Not Found");
});

// db.movies.updateOne({name: "RRR"}, {$set: {language: "Tamil"}})
router.put("/:id", async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  const result = await updateNotes(id, data);
  response.send(result);
});

export default router;
