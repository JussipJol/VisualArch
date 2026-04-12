import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined in .env");

  client = new MongoClient(uri);

  await client.connect();
  db = client.db("visualarch");

  // ── Create indexes for performance ─────────────────────────
  await Promise.all([
    db.collection("users").createIndex({ user_id: 1 }, { unique: true }),
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("users").createIndex({ username: 1 }, { unique: true }),
    db.collection("workspaces").createIndex({ workspace_id: 1 }, { unique: true }),
    db.collection("workspaces").createIndex({ owner_id: 1 }),
    db.collection("projects").createIndex({ project_id: 1 }, { unique: true }),
    db.collection("projects").createIndex({ workspace_id: 1 }),
  ]);

  console.log("✓ Connected to MongoDB Atlas (indexes ensured)");
  return db;
}

export function getDB(): Db {
  if (!db) throw new Error("Database not connected. Call connectDB() first.");
  return db;
}

/** Graceful shutdown — close MongoDB connection */
export async function disconnectDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("✓ MongoDB connection closed");
  }
}