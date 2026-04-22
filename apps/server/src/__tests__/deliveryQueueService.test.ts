import { describe, expect, it } from 'vitest';

import {
  generateDeliveryQueue,
  type NonprofitDeliveryData,
} from '../services/deliveryQueueService';

describe('generateDeliveryQueue', () => {
  it('computes need score from weighted one-sided z-scores using median/std', () => {
    const recipients: NonprofitDeliveryData[] = [
      {
        recipient: 'Neediest Org',
        daysSinceLastDelivery: 2,
        priorityLevel: 0,
        totalPoundsThisMonth: 0,
        totalDeliveriesThisMonth: 0,
        deliveryFrequency: 'None',
        location: 'North, CA',
      },
      {
        recipient: 'Recently Served Org',
        daysSinceLastDelivery: 0,
        priorityLevel: 2,
        totalPoundsThisMonth: 2,
        totalDeliveriesThisMonth: 2,
        deliveryFrequency: 'High',
        location: 'South, CA',
      },
    ];

    const queue = generateDeliveryQueue(recipients);
    const neediest = queue.find((r) => r.foodRecipient === 'Neediest Org');
    const recentlyServed = queue.find(
      (r) => r.foodRecipient === 'Recently Served Org',
    );

    // All five weighted components contribute exactly 1 std-dev in the
    // intended direction for "Neediest Org", so weighted sum is 1.00.
    expect(neediest?.needScore).toBe(100);
    expect(recentlyServed?.needScore).toBe(0);
  });

  it('rounds need scores to one decimal place', () => {
    const recipients: NonprofitDeliveryData[] = [
      {
        recipient: 'High Days',
        daysSinceLastDelivery: 2,
        priorityLevel: 2,
        totalPoundsThisMonth: 100,
        totalDeliveriesThisMonth: 3,
        deliveryFrequency: 'Low',
        location: 'A',
      },
      {
        recipient: 'Median Days',
        daysSinceLastDelivery: 1,
        priorityLevel: 2,
        totalPoundsThisMonth: 100,
        totalDeliveriesThisMonth: 3,
        deliveryFrequency: 'Low',
        location: 'B',
      },
      {
        recipient: 'Low Days',
        daysSinceLastDelivery: 0,
        priorityLevel: 2,
        totalPoundsThisMonth: 100,
        totalDeliveriesThisMonth: 3,
        deliveryFrequency: 'Low',
        location: 'C',
      },
    ];

    const queue = generateDeliveryQueue(recipients);
    const highDays = queue.find((r) => r.foodRecipient === 'High Days');

    expect(highDays?.needScore).toBe(42.9);
  });

  it('returns top 5 recipients sorted by need score descending', () => {
    const recipients: NonprofitDeliveryData[] = [
      {
        recipient: 'Alpha Pantry',
        daysSinceLastDelivery: 30,
        priorityLevel: 1,
        totalPoundsThisMonth: 50,
        totalDeliveriesThisMonth: 1,
        deliveryFrequency: 'None',
        location: 'A',
      },
      {
        recipient: 'Bravo Kitchen',
        daysSinceLastDelivery: 20,
        priorityLevel: 2,
        totalPoundsThisMonth: 80,
        totalDeliveriesThisMonth: 2,
        deliveryFrequency: 'Low',
        location: 'B',
      },
      {
        recipient: 'Charlie Center',
        daysSinceLastDelivery: 10,
        priorityLevel: 3,
        totalPoundsThisMonth: 120,
        totalDeliveriesThisMonth: 4,
        deliveryFrequency: 'Medium',
        location: 'C',
      },
      {
        recipient: 'Delta Mission',
        daysSinceLastDelivery: 5,
        priorityLevel: 4,
        totalPoundsThisMonth: 200,
        totalDeliveriesThisMonth: 8,
        deliveryFrequency: 'High',
        location: 'D',
      },
      {
        recipient: 'Echo Support',
        daysSinceLastDelivery: 15,
        priorityLevel: 2,
        totalPoundsThisMonth: 90,
        totalDeliveriesThisMonth: 2,
        deliveryFrequency: 'Low',
        location: 'E',
      },
      {
        recipient: 'Foxtrot Relief',
        daysSinceLastDelivery: 40,
        priorityLevel: 1,
        totalPoundsThisMonth: 40,
        totalDeliveriesThisMonth: 1,
        deliveryFrequency: 'None',
        location: 'F',
      },
    ];

    const queue = generateDeliveryQueue(recipients);

    expect(queue).toHaveLength(5);
    expect(queue.map((r) => r.needScore)).toEqual(
      [...queue.map((r) => r.needScore)].sort((a, b) => b - a),
    );
    expect(queue.some((r) => r.foodRecipient === 'Delta Mission')).toBe(false);
  });

  it('applies one-sided directional scoring and ignores opposite direction', () => {
    const recipients: NonprofitDeliveryData[] = [
      {
        recipient: 'Needs Days',
        daysSinceLastDelivery: 10,
        priorityLevel: 5,
        totalPoundsThisMonth: 500,
        totalDeliveriesThisMonth: 10,
        deliveryFrequency: 'High',
        location: 'North',
      },
      {
        recipient: 'Baseline A',
        daysSinceLastDelivery: 1,
        priorityLevel: 1,
        totalPoundsThisMonth: 100,
        totalDeliveriesThisMonth: 1,
        deliveryFrequency: 'Low',
        location: 'South',
      },
      {
        recipient: 'Baseline B',
        daysSinceLastDelivery: 1,
        priorityLevel: 1,
        totalPoundsThisMonth: 100,
        totalDeliveriesThisMonth: 1,
        deliveryFrequency: 'Low',
        location: 'East',
      },
    ];

    const queue = generateDeliveryQueue(recipients);
    const needsDays = queue.find((r) => r.foodRecipient === 'Needs Days');
    const baselineA = queue.find((r) => r.foodRecipient === 'Baseline A');

    expect(needsDays?.needScore).toBeGreaterThan(0);
    expect(baselineA?.needScore).toBe(0);
  });

  it('treats missing priority as neutral and still includes recipients', () => {
    const recipients: NonprofitDeliveryData[] = [
      {
        recipient: 'Org 1',
        daysSinceLastDelivery: 7,
        priorityLevel: null,
        totalPoundsThisMonth: 100,
        totalDeliveriesThisMonth: 3,
        deliveryFrequency: 'Low',
        location: undefined,
      },
      {
        recipient: 'Org 2',
        daysSinceLastDelivery: 7,
        priorityLevel: null,
        totalPoundsThisMonth: 100,
        totalDeliveriesThisMonth: 3,
        deliveryFrequency: 'Low',
        location: undefined,
      },
    ];

    const queue = generateDeliveryQueue(recipients);

    expect(queue).toHaveLength(2);
    expect(queue[0]?.needScore).toBe(0);
    expect(queue[1]?.needScore).toBe(0);
  });

  it('excludes recipients with missing non-priority required scoring inputs', () => {
    const recipients: NonprofitDeliveryData[] = [
      {
        recipient: 'Missing Days',
        daysSinceLastDelivery: null,
        priorityLevel: 2,
        totalPoundsThisMonth: 100,
        totalDeliveriesThisMonth: 3,
        deliveryFrequency: 'Low',
        location: 'A',
      },
      {
        recipient: 'Valid Org',
        daysSinceLastDelivery: 7,
        priorityLevel: 2,
        totalPoundsThisMonth: 100,
        totalDeliveriesThisMonth: 3,
        deliveryFrequency: 'Low',
        location: 'B',
      },
    ];

    const queue = generateDeliveryQueue(recipients);

    expect(queue).toHaveLength(1);
    expect(queue[0]?.foodRecipient).toBe('Valid Org');
  });

  it('never emits null needScore when source numeric fields contain NaN', () => {
    const recipients: NonprofitDeliveryData[] = [
      {
        recipient: 'Org A',
        daysSinceLastDelivery: 8,
        priorityLevel: Number.NaN,
        totalPoundsThisMonth: 100,
        totalDeliveriesThisMonth: 2,
        deliveryFrequency: 'Low',
        location: 'A',
      },
      {
        recipient: 'Org B',
        daysSinceLastDelivery: 2,
        priorityLevel: 2,
        totalPoundsThisMonth: 120,
        totalDeliveriesThisMonth: 4,
        deliveryFrequency: 'Medium',
        location: 'B',
      },
    ];

    const queue = generateDeliveryQueue(recipients);

    expect(queue).toHaveLength(2);
    for (const row of queue) {
      expect(typeof row.needScore).toBe('number');
      expect(Number.isFinite(row.needScore)).toBe(true);
      expect(Object.keys(row).sort()).toEqual([
        'daysSinceLastDelivery',
        'foodRecipient',
        'location',
        'needScore',
      ]);
    }
  });
});
