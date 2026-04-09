/**
 * Compute the standard deviation of an array of numbers (population std dev).
 */
export function calcStdDev(values: number[]): number {
  if (values.length === 0) return 0;

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.reduce((sum, v) => sum + (v - mean) ** 2, 0);

  return Math.sqrt(squaredDiffs / values.length);
}

/**
 * Compute the median of an array of numbers.
 */
export function calcMedian(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Running state for incremental standard deviation (Welford's algorithm).
 */
export interface RunningStdDevState {
  count: number;
  mean: number;
  m2: number; // sum of squared differences from the mean
}

/**
 * Create initial running state from scratch.
 */
export function initRunningStdDev(): RunningStdDevState {
  return { count: 0, mean: 0, m2: 0 };
}

/**
 * Create running state from an existing array so you can continue adding values incrementally.
 */
export function runningStdDevFromArray(values: number[]): RunningStdDevState {
  let state = initRunningStdDev();
  for (const value of values) {
    state = addToRunningStdDev(state, value);
  }
  return state;
}

/**
 * Add a new value to the running std dev state and return the updated state.
 * Uses Welford's online algorithm.
 */
export function addToRunningStdDev(
  state: RunningStdDevState,
  newValue: number,
): RunningStdDevState {
  const count = state.count + 1;
  const delta = newValue - state.mean;
  const mean = state.mean + delta / count;
  const delta2 = newValue - mean;
  const m2 = state.m2 + delta * delta2;

  return { count, mean, m2 };
}

/**
 * Get the current standard deviation from running state.
 */
export function getStdDev(state: RunningStdDevState): number {
  if (state.count === 0) return 0;
  return Math.sqrt(state.m2 / state.count);
}

/**
 * Add a value to a sorted array and return the new median.
 * Mutates the array by inserting in sorted order.
 *
 * Note: Unlike std dev, median cannot be computed incrementally from just
 * the previous median + count. You need the underlying sorted data.
 */
export function addToSortedAndGetMedian(
  sorted: number[],
  newValue: number,
): number {
  // Binary search for insertion index
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (sorted[mid] < newValue) lo = mid + 1;
    else hi = mid;
  }
  sorted.splice(lo, 0, newValue);

  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}
