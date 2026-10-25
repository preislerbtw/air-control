import { Schema, model } from "mongoose";

const scheduleSchema = new Schema(
  {
    deviceId: { type: Schema.Types.ObjectId, ref: "Device", required: true },
    name: { type: String, required: true },
    cron: { type: String, required: true }, // ex.: "0 22 * * *"
    action: { type: Schema.Types.Mixed, required: true }, // ex.: { power: true, mode: "cool", targetTemp: 23 }
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);
scheduleSchema.index({ deviceId: 1, enabled: 1 });

export const Schedule = model("Schedule", scheduleSchema);
