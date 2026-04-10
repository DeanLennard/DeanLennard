import { ObjectId } from "mongodb";

import { getDatabase } from "@/lib/mongodb";

export type CustomerNoteRecord = {
  id: string;
  clientId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

function getCustomerNotesCollection() {
  return getDatabase().then((db) =>
    db.collection<CustomerNoteRecord>("customer_notes")
  );
}

export async function addCustomerNote(clientId: string, note: string) {
  const trimmedNote = note.trim();

  if (!trimmedNote) {
    throw new Error("A note is required.");
  }

  const collection = await getCustomerNotesCollection();
  const now = new Date().toISOString();

  await collection.insertOne({
    id: new ObjectId().toHexString(),
    clientId,
    note: trimmedNote,
    createdAt: now,
    updatedAt: now,
  });
}

export async function listCustomerNotes(clientId: string) {
  const collection = await getCustomerNotesCollection();
  return collection.find({ clientId }).sort({ createdAt: -1 }).toArray();
}
