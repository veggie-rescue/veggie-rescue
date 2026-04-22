import type { Response } from 'supertest';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/googleSheetsService', () => ({
  getParsedNonprofitData: vi.fn(),
}));

import app from '../app';
import { getParsedNonprofitData } from '../services/googleSheetsService';

const getBody = <T>(res: Response): T => res.body as T;

describe('Deliveries API', () => {
  beforeEach(() => {
    process.env.ACCESS_CODE = 'test-access-code';
    vi.clearAllMocks();
  });

  it('returns a ranked delivery queue of exactly five recipients', async () => {
    vi.mocked(getParsedNonprofitData).mockResolvedValue([
      {
        recipient: 'North Pantry',
        lastDelivery: '2026-04-01',
        daysSinceLastDelivery: 20,
        totalDeliveriesThisMonth: 1,
        totalPoundsThisMonth: 50,
        totalDeliveriesThisYear: 5,
        totalPoundsThisYear: 300,
        avgPoundsPerDelivery: 50,
        priorityLevel: 1,
        deliveryFrequency: 'None',
        location: 'North, CA',
      },
      {
        recipient: 'South Kitchen',
        lastDelivery: '2026-04-10',
        daysSinceLastDelivery: 11,
        totalDeliveriesThisMonth: 2,
        totalPoundsThisMonth: 90,
        totalDeliveriesThisYear: 10,
        totalPoundsThisYear: 700,
        avgPoundsPerDelivery: 45,
        priorityLevel: 2,
        deliveryFrequency: 'Low',
        location: 'South, CA',
      },
      {
        recipient: 'East Mission',
        lastDelivery: '2026-04-15',
        daysSinceLastDelivery: 6,
        totalDeliveriesThisMonth: 6,
        totalPoundsThisMonth: 220,
        totalDeliveriesThisYear: 15,
        totalPoundsThisYear: 1200,
        avgPoundsPerDelivery: 36.7,
        priorityLevel: 4,
        deliveryFrequency: 'High',
        location: 'East, CA',
      },
      {
        recipient: 'West Support',
        lastDelivery: '2026-04-08',
        daysSinceLastDelivery: 13,
        totalDeliveriesThisMonth: 2,
        totalPoundsThisMonth: 80,
        totalDeliveriesThisYear: 9,
        totalPoundsThisYear: 640,
        avgPoundsPerDelivery: 40,
        priorityLevel: 2,
        deliveryFrequency: 'Low',
        location: 'West, CA',
      },
      {
        recipient: 'Central Aid',
        lastDelivery: '2026-04-05',
        daysSinceLastDelivery: 16,
        totalDeliveriesThisMonth: 1,
        totalPoundsThisMonth: 60,
        totalDeliveriesThisYear: 7,
        totalPoundsThisYear: 390,
        avgPoundsPerDelivery: 60,
        priorityLevel: 1,
        deliveryFrequency: 'None',
        location: 'Central, CA',
      },
      {
        recipient: 'Harbor Help',
        lastDelivery: '2026-04-18',
        daysSinceLastDelivery: 3,
        totalDeliveriesThisMonth: 7,
        totalPoundsThisMonth: 300,
        totalDeliveriesThisYear: 20,
        totalPoundsThisYear: 1800,
        avgPoundsPerDelivery: 42.8,
        priorityLevel: 5,
        deliveryFrequency: 'High',
        location: 'Harbor, CA',
      },
    ]);

    const response = await request(app)
      .get('/deliveries/queue')
      .set('Authorization', 'Bearer test-access-code');

    expect(response.status).toBe(200);

    const body = getBody<
      Array<{
        foodRecipient: string;
        needScore: number;
        location: string | null;
        daysSinceLastDelivery: number | null;
      }>
    >(response);

    expect(body).toHaveLength(5);
    expect(body[0]?.needScore).toBeGreaterThanOrEqual(body[1]?.needScore ?? 0);
    expect(body[4]?.needScore).toBeGreaterThanOrEqual(0);
    expect(body[0]).toEqual(
      expect.objectContaining({
        foodRecipient: expect.any(String),
        needScore: expect.any(Number),
        location: expect.any(String),
        daysSinceLastDelivery: expect.any(Number),
      }),
    );
  });
});
