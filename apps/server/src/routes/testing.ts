import { Router } from "express";
import { getParsedNonprofitData } from "../services/googleSheetsService";

const router = Router();

router.get("/", async (req, res) => {
  const data = await getParsedNonprofitData();
  res.json(data);
});

export default router;
