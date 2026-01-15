import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Veggie Rescue Server is running!' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default app;
