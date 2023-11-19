
import { ObjectId } from "mongodb";
import { client } from "../index.js";

export async function updateNotes(id, data) {
  return await client
    .db("Notes_Taking")
    .collection("Notes")
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
}
export async function deleteNotes(id) {
  return await client.db("Notes_Taking").collection("Notes").deleteOne({ _id: new ObjectId(id) });
}
export async function createNotes(data) {
  return await client.db("Notes_Taking").collection("Notes").insertMany(data);
}
export async function getNotesbyID(id) {
  return await client.db("Notes_Taking").collection("Notes").findOne({ _id: new ObjectId(id) });
}
export async function getNotes(query) {
  return await client.db("Notes_Taking").collection("Notes").find(query).toArray();
}