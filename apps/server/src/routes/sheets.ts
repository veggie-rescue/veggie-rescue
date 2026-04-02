import { Router } from 'express';
import { getParsedNonprofitData } from '../services/googleSheetsService';

const router = Router();

// // Mock Google Sheets API response format
// const mockSheetData = {
//   range: 'Sheet1!A1:C2',
//   majorDimension: 'ROWS',
//   values: [
//     ['Name', 'Age', 'City'],
//     ['Alice', '30', 'New York'],
//   ],
// };

// // GET /sheets - Get mock sheet data
// router.get('/', (req, res) => {
//   res.json({ data: mockSheetData });
// });

const objectsToSheetValues = (rows: Record<string, any>[]): string[][] => {
  if (!rows.length) return [];

  const headers = Object.keys(rows[0]);

  const values = rows.map((row) =>
    headers.map((header) => String(row[header] ?? ""))
  );

  return [headers, ...values];
};

router.get("/", async (req, res) => {
  try {

    const parsedData = await getParsedNonprofitData();

    const values = objectsToSheetValues(parsedData);

    res.json({
      data: {
        range: "dashboard",  
        majorDimension: "ROWS",
        values
      }
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch Google Sheets data"
    });
  }
});

export default router;