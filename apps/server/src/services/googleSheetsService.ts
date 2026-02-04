const fetchSheetValues = async (
  spreadsheetId: string,
  range: string,
): Promise<string[][]> => {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sheets API error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.values ?? [];
};

const rowsToObjects = (values: string[][]): Record<string, string>[] => {
  if (!values || values.length === 0) return [];

  const headers = values[0]?.map((h) => h.trim());
  const rows = values.slice(1);

  return rows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = (row[i] ?? '').toString().trim();
    });
    return obj;
  });
};

const isSameMonth = (date: string, present = new Date(2025, 10)) => {
  const d = new Date(date);
  return (
    d.getMonth() === present.getMonth() &&
    d.getFullYear() === present.getFullYear()
  );
};

const isSameYear = (date: string, present = new Date(2025, 10)) => {
  const d = new Date(date);
  return d.getFullYear() === present.getFullYear();
};

type RecipientInfo = {
  priorityLevel: number | null;
  location: string | null;
};

type Totals = {
  lastDelivery: Date | null;
  totalDeliveriesThisMonth: number | 0;
  totalPoundsThisMonth: number | 0;
  totalDeliveriesThisYear: number | 0;
  totalPoundsThisYear: number | 0;
};

const loadRecipientMap = async (): Promise<Map<string, RecipientInfo>> => {
  // mapping and delivery dashboard

  const recipientData = await fetchSheetValues(
    '13tTXxSsk59AuCTKTW_6u2wNCcuenXBATYdB10AKgN88',
    'Food_Recipients!A:H',
  );

  const recipientObjects = rowsToObjects(recipientData);

  const recipientMap = new Map<string, RecipientInfo>();

  for (const r of recipientObjects) {
    const name = r['Name'];
    if (!name) continue;

    recipientMap.set(name, {
      priorityLevel: r['priority'] ? Number(r['priority']) : null,
      location: r['Address'] ?? null,
    });
  }

  return recipientMap;
};

const loadMasterSheet = async (): Promise<Map<string, Totals>> => {
  // master sheet

  const masterData = await fetchSheetValues(
    '16IYJNVI5Bgnnx17VzJm3nigq0VcQjz8DN43RCeQM80M',
    'Form responses!B:P',
  );

  const individualDeliveryObjects = rowsToObjects(masterData);

  const totalsMap = new Map<string, Totals>();

  for (const r of individualDeliveryObjects) {
    // for every delivery
    const name = r['Food Recipient'];
    const dateString = r['Delivery Date'];
    const pounds = Number(r['Total Pounds'] || 0);

    if (!name || !dateString) continue;

    const deliveryDate = new Date(dateString);

    if (!totalsMap.has(name)) {
      // make object if name doesn't exist already
      totalsMap.set(name, {
        lastDelivery: null,
        totalDeliveriesThisMonth: 0,
        totalDeliveriesThisYear: 0,
        totalPoundsThisMonth: 0,
        totalPoundsThisYear: 0,
      });
    }

    const totals = totalsMap.get(name)!;

    if (isSameMonth(dateString)) {
      totals.totalDeliveriesThisMonth += 1;
      totals.totalPoundsThisMonth += pounds;
    }

    if (isSameYear(dateString)) {
      totals.totalDeliveriesThisYear += 1;
      totals.totalPoundsThisYear += pounds;
    }

    if (!totals.lastDelivery || deliveryDate > totals.lastDelivery) {
      totals.lastDelivery = deliveryDate;
    }
  }

  return totalsMap;
};

type DeliveryFrequency = 'None' | 'Low' | 'Medium' | 'High';

const getDeliveryFrequency = (count: number): DeliveryFrequency => {
  if (count === 0) {
    return 'None';
  } else if (count <= 3 && count >= 1) {
    return 'Low';
  } else if (count <= 7 && count >= 4) {
    return 'Medium';
  } else {
    return 'High';
  }
};

export const getParsedNonprofitData = async () => {
  const recipientMap = await loadRecipientMap();
  const totalsMap = await loadMasterSheet();

  const result = Array.from(totalsMap.entries()).map(([name, totals]) => {
    const nonprofitName = recipientMap.get(name);

    return {
      recipient: name,

      lastDelivery: totals.lastDelivery
        ? totals.lastDelivery.toISOString().split('T')[0]
        : null,
      totalDeliveriesThisMonth: totals.totalDeliveriesThisMonth,
      totalPoundsThisMonth: totals.totalPoundsThisMonth,
      totalDeliveriesThisYear: totals.totalDeliveriesThisYear,
      totalPoundsThisYear: totals.totalPoundsThisYear,
      avgPoundsPerDelivery:
        totals.totalDeliveriesThisMonth > 0
          ? totals.totalPoundsThisMonth / totals.totalDeliveriesThisMonth
          : 0,
      priorityLevel: nonprofitName?.priorityLevel,
      deliveryFrequency: getDeliveryFrequency(totals.totalDeliveriesThisMonth),
      location: nonprofitName?.location,
    };
  });

  return result;
};
