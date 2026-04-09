import { Router } from 'express';

import { getParsedRecipientData } from '../services/googleSheetsService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await getParsedRecipientData();
    const stringified = data.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([k, v]) => [k, String(v ?? '')])
      )
    );
    res.json(stringified);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipient data' });
  }
});

export default router;
