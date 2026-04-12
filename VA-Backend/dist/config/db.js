"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.getDB = getDB;
exports.disconnectDB = disconnectDB;
const mongodb_1 = require("mongodb");
let client = null;
let db = null;
async function connectDB() {
    if (db)
        return db;
    const uri = process.env.MONGODB_URI;
    if (!uri)
        throw new Error("MONGODB_URI is not defined in .env");
    client = new mongodb_1.MongoClient(uri, {
        tls: true,
        // TLS certificate validation enabled (secure default)
    });
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
function getDB() {
    if (!db)
        throw new Error("Database not connected. Call connectDB() first.");
    return db;
}
/** Graceful shutdown — close MongoDB connection */
async function disconnectDB() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log("✓ MongoDB connection closed");
    }
}
