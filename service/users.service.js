import { client } from "../index.js";

export async function createUsers(data) {
  return await client.db("Money-Manger").collection("users").insertOne(data);
}

export async function getUserByName(username) {
    return await client.db("Money-Manger").collection("users").findOne({ username: username });
  }

  export async function updateUser(id,newPassword) {
    return await client
      .db("Money-Manger")
      .collection("money")
      .updateOne({ _id: new ObjectId(id) }, { $set: newPassword });
  } 


  