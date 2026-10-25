import { Schema, model } from "mongoose";

// A colecao e criada como time series em connection.ts
const readingSchema = new Schema(
  {
    timestamp: { type: Date, required: true },
    meta: { deviceId: { type: String, required: true } },
    power: Boolean,
    mode: String,
    targetTemp: Number,
    indoorTemp: Number,
    outdoorTemp: Number,
  },
  { versionKey: false, autoCreate: false, autoIndex: false }
);

export const Reading = model("Reading", readingSchema, "readings");
