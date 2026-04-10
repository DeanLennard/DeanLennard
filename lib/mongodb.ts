import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI ?? "";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME ?? "deanlennard";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

function getClientPromise() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  const clientPromise =
    global.__mongoClientPromise__ ??
    new MongoClient(MONGODB_URI).connect();

  if (process.env.NODE_ENV !== "production") {
    global.__mongoClientPromise__ = clientPromise;
  }

  return clientPromise;
}

export async function getDatabase() {
  const client = await getClientPromise();
  return client.db(MONGODB_DB_NAME);
}
