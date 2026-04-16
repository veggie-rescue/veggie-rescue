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

// Full-day calendar difference in UTC. `new Date("YYYY-MM-DD")` parses as
// UTC midnight, so using UTC getters on both sides keeps the comparison in
// the same reference frame regardless of the server's local timezone. This
// also avoids DST boundary errors that raw ms subtraction would introduce.
const daysBetween = (from: Date, to: Date): number => {
  const fromUtc = Date.UTC(
    from.getUTCFullYear(),
    from.getUTCMonth(),
    from.getUTCDate(),
  );
  const toUtc = Date.UTC(
    to.getUTCFullYear(),
    to.getUTCMonth(),
    to.getUTCDate(),
  );
  return Math.max(0, Math.floor((toUtc - fromUtc) / (1000 * 60 * 60 * 24)));
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

export type RecipientRow = {
  name: string;
  accepts: string;
  orgType: string;
  demographicServed: string;
  location: string;
  priority: string;
  address: string;
  availableDeliveryDays: string;
  contact: string;
  contactPhone: string;
  officeContact: string;
  officePhone: string;
  officeEmail: string;
  notes: string;
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
      daysSinceLastDelivery: totals.lastDelivery
        ? daysBetween(totals.lastDelivery, new Date())
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

// Header keys here must match the exact casing/spacing used in the
// Food_Recipients sheet (note: some are lowercase, e.g. "location",
// "priority", "available delivery days").
const RECIPIENT_HEADERS = {
  name: 'Name',
  accepts: 'Accepts',
  orgType: 'Org Type',
  demographicServed: 'Demographic Served',
  location: 'location',
  priority: 'priority',
  address: 'Address',
  availableDeliveryDays: 'available delivery days',
  contact: 'Contact',
  contactPhone: 'Contact Phone',
  officeContact: 'Office Contact',
  officePhone: 'Office Phone',
  officeEmail: 'Office Email',
  notes: 'Notes',
} as const satisfies Record<keyof RecipientRow, string>;

export const getParsedRecipientData = async (): Promise<RecipientRow[]> => {
  const recipientData = await fetchSheetValues(
    '13tTXxSsk59AuCTKTW_6u2wNCcuenXBATYdB10AKgN88',
    'Food_Recipients!A:O',
  );

  const recipientObjects = rowsToObjects(recipientData);

  return recipientObjects
    .filter((r) => r[RECIPIENT_HEADERS.name])
    .map((r) => {
      const row = {} as RecipientRow;
      for (const [field, header] of Object.entries(RECIPIENT_HEADERS) as [
        keyof RecipientRow,
        string,
      ][]) {
        row[field] = r[header] ?? '';
      }
      return row;
    });
};
