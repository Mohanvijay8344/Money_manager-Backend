
import { ObjectId } from "mongodb";
import { client } from "../index.js";

export async function updateMoney(id, data) {
  return await client
    .db("Money-Manger")
    .collection("money")
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
}
export async function deleteMoney(id) {
  return await client.db("Money-Manger").collection("money").deleteOne({ _id: new ObjectId(id) });
}
export async function createMoney(data) {
  return await client.db("Money-Manger").collection("money").insertMany(data);
}
export async function getMoneybyID(id) {
  return await client.db("Money-Manger").collection("money").findOne({ _id: new ObjectId(id) });
}
export async function getMoney(query) {
  return await client.db("Money-Manger").collection("money").find(query).toArray();
}