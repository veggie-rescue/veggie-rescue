import type { Request, Response } from 'express';
import express from 'express';

import { errorHandler } from './middleware/errorHandler';
import donationRoutes from './routes/donations';
import sheetsRoutes from './routes/sheets';

const app = express();
import testing from './routes/testing';

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Veggie Rescue Server is running!' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/donations', donationRoutes);
app.use('/sheets', sheetsRoutes);
app.use("/testing", testing);

app.use(errorHandler);

export default app;
