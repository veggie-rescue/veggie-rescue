import { describe, expect, it } from 'vitest';

import {
  addToRunningStdDev,
  calcMedian,
  calcSampleStdDev,
  calcStdDev,
  getSampleStdDev,
  getStdDev,
  initRunningStdDev,
  insertIntoSortedAndGetMedian,
  runningStdDevFromArray,
} from '../utils/stats';

describe('calcStdDev (population)', () => {
  it('computes std dev of a simple set', () => {
    // values: [2, 4, 4, 4, 5, 5, 7, 9], mean 5, pop std dev = 2
    expect(calcStdDev([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2);
  });

  it('returns 0 when all values are equal', () => {
    expect(calcStdDev([7, 7, 7, 7])).toBe(0);
  });

  it('handles a single value', () => {
    expect(calcStdDev([42])).toBe(0);
  });

  it('handles negative values', () => {
    expect(calcStdDev([-2, -4, -4, -4, -5, -5, -7, -9])).toBeCloseTo(2);
  });

  it('throws on an empty array', () => {
    expect(() => calcStdDev([])).toThrow();
  });
});

describe('calcSampleStdDev', () => {
  it('uses the n-1 denominator', () => {
    // values: [2, 4, 4, 4, 5, 5, 7, 9]; sample std dev ≈ 2.138
    expect(calcSampleStdDev([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(
      2.13808993529,
      5,
    );
  });

  it('throws on arrays with fewer than 2 values', () => {
    expect(() => calcSampleStdDev([])).toThrow();
    expect(() => calcSampleStdDev([1])).toThrow();
  });
});

describe('calcMedian', () => {
  it('returns the middle value for odd-length arrays', () => {
    expect(calcMedian([3, 1, 2])).toBe(2);
  });

  it('returns the average of the two middle values for even-length arrays', () => {
    expect(calcMedian([1, 2, 3, 4])).toBe(2.5);
  });

  it('handles unsorted input', () => {
    expect(calcMedian([9, 1, 5, 3, 7])).toBe(5);
  });

  it('handles a single value', () => {
    expect(calcMedian([10])).toBe(10);
  });

  it('does not mutate the input', () => {
    const input = [3, 1, 2];
    calcMedian(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it('throws on an empty array', () => {
    expect(() => calcMedian([])).toThrow();
  });
});

describe('running std dev (Welford)', () => {
  it('matches calcStdDev after adding the same values', () => {
    const values = [2, 4, 4, 4, 5, 5, 7, 9];
    let state = initRunningStdDev();
    for (const v of values) state = addToRunningStdDev(state, v);

    expect(getStdDev(state)).toBeCloseTo(calcStdDev(values));
  });

  it('matches calcSampleStdDev via getSampleStdDev', () => {
    const values = [2, 4, 4, 4, 5, 5, 7, 9];
    const state = runningStdDevFromArray(values);

    expect(getSampleStdDev(state)).toBeCloseTo(calcSampleStdDev(values));
  });

  it('runningStdDevFromArray seeds correctly', () => {
    const state = runningStdDevFromArray([10, 20, 30]);
    expect(state.count).toBe(3);
    expect(state.mean).toBeCloseTo(20);
  });

  it('handles large numbers without catastrophic cancellation', () => {
    // Welford's advantage: stable even when values are large + similar
    const values = [1e9 + 4, 1e9 + 7, 1e9 + 13, 1e9 + 16];
    const state = runningStdDevFromArray(values);
    expect(getStdDev(state)).toBeCloseTo(calcStdDev(values));
  });

  it('getStdDev throws on empty state', () => {
    expect(() => getStdDev(initRunningStdDev())).toThrow();
  });

  it('getSampleStdDev throws with fewer than 2 samples', () => {
    const state = addToRunningStdDev(initRunningStdDev(), 5);
    expect(() => getSampleStdDev(state)).toThrow();
  });
});

describe('insertIntoSortedAndGetMedian', () => {
  it('inserts and returns correct median for a growing stream', () => {
    const sorted: number[] = [];
    expect(insertIntoSortedAndGetMedian(sorted, 5)).toBe(5);
    expect(insertIntoSortedAndGetMedian(sorted, 1)).toBe(3);
    expect(insertIntoSortedAndGetMedian(sorted, 10)).toBe(5);
    expect(insertIntoSortedAndGetMedian(sorted, 3)).toBe(4);
    expect(sorted).toEqual([1, 3, 5, 10]);
  });

  it('maintains sort order after insertion', () => {
    const sorted = [1, 3, 5, 7];
    insertIntoSortedAndGetMedian(sorted, 4);
    expect(sorted).toEqual([1, 3, 4, 5, 7]);
  });

  it('handles inserting at the beginning and end', () => {
    const sorted = [5, 10];
    insertIntoSortedAndGetMedian(sorted, 1);
    expect(sorted[0]).toBe(1);
    insertIntoSortedAndGetMedian(sorted, 100);
    expect(sorted[sorted.length - 1]).toBe(100);
  });

  it('handles duplicates', () => {
    const sorted = [1, 2, 3];
    insertIntoSortedAndGetMedian(sorted, 2);
    expect(sorted).toEqual([1, 2, 2, 3]);
  });
});
