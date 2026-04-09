import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';

import { authentication } from './middleware/auth';
import { corsOptions } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { rateLimit } from './middleware/rateLimit';
import donationRoutes from './routes/donations';
import recipientRoutes from './routes/recipients';
import sheetsRoutes from './routes/sheets';

const app = express();
import testing from './routes/testing';

app.use(express.json());
app.use(rateLimit);
app.use(cors(corsOptions));
// app.use(authentication);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Veggie Rescue Server is running!' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/donations', authentication, donationRoutes);
app.use('/sheets', authentication, sheetsRoutes);
app.use('/recipients', recipientRoutes);
app.use('/testing', testing);

app.use(errorHandler);

export default app;
