import { Schema, model } from "mongoose";

const presetSchema = new Schema(
  {
    name: { type: String, required: true },
    settings: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Preset = model("Preset", presetSchema);
