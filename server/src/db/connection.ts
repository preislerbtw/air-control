import mongoose from "mongoose";
import { config } from "../config.js";

export async function connectDb() {
  await mongoose.connect(config.mongoUri);
  await ensureReadingsCollection();
  console.log("MongoDB conectado");
}

// Cria a colecao de series temporais (so na primeira vez).
async function ensureReadingsCollection() {
  const db = mongoose.connection.db!;
  const exists = await db.listCollections({ name: "readings" }).hasNext();
  if (exists) return;
  await db.createCollection("readings", {
    timeseries: { timeField: "timestamp", metaField: "meta", granularity: "minutes" },
    expireAfterSeconds: 60 * 60 * 24 * 90, // 90 dias
  });
}
