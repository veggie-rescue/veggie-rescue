import { Router } from 'express';

const router = Router();

// Mock Google Sheets API response format
const mockSheetData = {
  range: 'Sheet1!A1:C2',
  majorDimension: 'ROWS',
  values: [
    ['Name', 'Age', 'City'],
    ['Alice', '30', 'New York'],
  ],
};

// GET /sheets - Get mock sheet data
router.get('/', (req, res) => {
  res.json({ data: mockSheetData });
});

// PUT /sheets - Update mock sheet data (returns what was sent)
router.put('/', (req, res) => {
  // In a real implementation, this would update the data
  // For now, just echo back the request body with success
  const body = req.body as typeof mockSheetData;
  res.json({ data: body });
});

export default router;
