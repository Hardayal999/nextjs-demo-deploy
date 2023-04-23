import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const client = await MongoClient.connect(
      "mongodb+srv://prince:eVE0yoWA59KS9FKn@cluster0.lijdhrb.mongodb.net/meetups?retryWrites=true&w=majority"
    ); /*Here i've created the database named meetups */

    const db =
      client.db(); /*I connect to database here as Ive received the client object and with the help client.db */
    const meetupsCollection =
      db.collection("meetups"); /*i make the collection */

    const result = await meetupsCollection.insertOne(
      data
    ); /*Here Ive added document in to my collections */

    console.log(result);
    client.close();

    res.status(201).json({ message: "Meetup inserted" });
  }
}

export default handler;
