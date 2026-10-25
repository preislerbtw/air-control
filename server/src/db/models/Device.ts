import { Schema, model } from "mongoose";

const deviceSchema = new Schema(
  {
    name: { type: String, required: true },
    ip: { type: String, required: true, unique: true },
    brand: { type: String, default: "Springer Midea" },
    capabilities: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Device = model("Device", deviceSchema);
