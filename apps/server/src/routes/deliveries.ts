import { Router } from 'express';

import { generateDeliveryQueue } from '../services/deliveryQueueService';
import { getParsedNonprofitData } from '../services/googleSheetsService';

const router = Router();

router.get('/queue', async (req, res, next) => {
  try {
    const parsedData = await getParsedNonprofitData();
    const queue = generateDeliveryQueue(parsedData);
    res.json(queue);
  } catch (error) {
    next(error);
  }
});

export default router;
