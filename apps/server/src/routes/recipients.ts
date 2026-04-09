import { Router } from 'express';

import { getParsedRecipientData } from '../services/googleSheetsService';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await getParsedRecipientData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipient data' });
  }
});

export default router;
