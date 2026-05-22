import { MongoClient } from 'mongodb';

const password = encodeURIComponent("");
const url="mongodb+srv://akankshagupta9210_db_user:" + password + "@todoproject.3gbpibp.mongodb.net/?appName=todoProject"

const client = new MongoClient(url);

async function connectDB() {
  await client.connect();
  const db = client.db("todoProject");
  return db;
}

export default connectDB;