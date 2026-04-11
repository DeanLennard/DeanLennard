import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI ?? "";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME ?? "deanlennard";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
  var __mongoClient__: MongoClient | undefined;
}

function getClientPromise() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (!global.__mongoClient__) {
    global.__mongoClient__ = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 60_000,
      serverSelectionTimeoutMS: 5_000,
    });
  }

  const clientPromise =
    global.__mongoClientPromise__ ?? global.__mongoClient__.connect();

  global.__mongoClientPromise__ = clientPromise;

  return clientPromise;
}

export async function getDatabase() {
  const client = await getClientPromise();
  return client.db(MONGODB_DB_NAME);
}
