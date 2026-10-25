import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGO_URI ?? "mongodb://localhost:27017/ac_control",
  deviceServiceUrl: process.env.DEVICE_SERVICE_URL ?? "http://127.0.0.1:8001",
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS ?? 5000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
};
