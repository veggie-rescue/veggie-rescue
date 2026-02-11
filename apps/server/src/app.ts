import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { corsOptions } from './middleware/cors';

import { errorHandler } from './middleware/errorHandler';
import donationRoutes from './routes/donations';
import sheetsRoutes from './routes/sheets';

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.options('/', cors());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Veggie Rescue Server is running!' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/donations', donationRoutes);
app.use('/sheets', sheetsRoutes);

app.use(errorHandler);

export default app;
