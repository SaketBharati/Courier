import { MongoClient, ServerApiVersion } from "mongodb";

const { DB_USER, DB_PASS, DB_NAME } = process.env;

if (!DB_USER || !DB_PASS || !DB_NAME) {
  throw new Error("Database environment variables are missing");
}

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@parceldb.bsdwu2t.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=ParcelDB`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

export let usersCollection;
export let parcelsCollection;

export async function connectDB() {
  if (db) return db;

  try {
    await client.connect();

    db = client.db(DB_NAME);

    usersCollection = db.collection("users");
    parcelsCollection = db.collection("parcels");

    console.log("MongoDB connected successfully");

    return db;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}