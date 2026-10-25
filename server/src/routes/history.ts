import { Router } from "express";
import { Reading } from "../db/models/Reading.js";

export const historyRouter = Router();

// Media de temperatura por hora nas ultimas 24h (exercicio de aggregation)
historyRouter.get("/hourly", async (_req, res) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const data = await Reading.aggregate([
    { $match: { timestamp: { $gte: since } } },
    {
      $group: {
        _id: { $dateTrunc: { date: "$timestamp", unit: "hour" } },
        indoorAvg: { $avg: "$indoorTemp" },
        targetAvg: { $avg: "$targetTemp" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json(data);
});
