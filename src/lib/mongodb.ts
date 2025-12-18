import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://renzmarr06_db_user:EbTynF0OhLWL1nbi@cycleiqcluster.5lgkwbk.mongodb.net/cycleiq';
let client: MongoClient;
let db: Db;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('dloop');
  }
  return db;
}