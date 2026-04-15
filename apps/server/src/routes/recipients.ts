import { Router } from 'express';

import { getParsedRecipientData } from '../services/googleSheetsService';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await getParsedRecipientData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
