/**
 * Compute the population standard deviation of an array.
 * Throws on empty input — std dev of no data is undefined.
 */
export function calcStdDev(values: readonly number[]): number {
  if (values.length === 0) {
    throw new Error('calcStdDev: cannot compute std dev of an empty array');
  }

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.reduce((sum, v) => sum + (v - mean) ** 2, 0);

  return Math.sqrt(squaredDiffs / values.length);
}

/**
 * Compute the sample standard deviation (Bessel-corrected, n-1 denominator).
 * Throws on arrays of length < 2 — sample std dev is undefined.
 */
export function calcSampleStdDev(values: readonly number[]): number {
  if (values.length < 2) {
    throw new Error(
      'calcSampleStdDev: need at least 2 values for sample std dev',
    );
  }

  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.reduce((sum, v) => sum + (v - mean) ** 2, 0);

  return Math.sqrt(squaredDiffs / (values.length - 1));
}

/**
 * Compute the median of an array. Throws on empty input.
 */
export function calcMedian(values: readonly number[]): number {
  if (values.length === 0) {
    throw new Error('calcMedian: cannot compute median of an empty array');
  }

  const sorted = [...values].sort((a, b) => a - b);
  return medianOfSorted(sorted);
}

function medianOfSorted(sorted: readonly number[]): number {
  const len = sorted.length;
  const mid = Math.floor(len / 2);

  if (len % 2 === 0) {
    return ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
  }
  return sorted[mid] as number;
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
export function runningStdDevFromArray(
  values: readonly number[],
): RunningStdDevState {
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
 * Get the current population standard deviation from running state.
 * Matches calcStdDev (n denominator). Throws on empty state.
 */
export function getStdDev(state: RunningStdDevState): number {
  if (state.count === 0) {
    throw new Error('getStdDev: state has no data');
  }
  return Math.sqrt(state.m2 / state.count);
}

/**
 * Get the current sample standard deviation from running state.
 * Matches calcSampleStdDev (n-1 denominator). Throws on count < 2.
 */
export function getSampleStdDev(state: RunningStdDevState): number {
  if (state.count < 2) {
    throw new Error(
      'getSampleStdDev: need at least 2 values for sample std dev',
    );
  }
  return Math.sqrt(state.m2 / (state.count - 1));
}

/**
 * MUTATES `sorted` by inserting `newValue` in sorted order, then returns
 * the new median of the resulting array.
 *
 * The sorted array IS the state — callers must keep it across updates.
 * Assumes `sorted` is already ascending; undefined behavior otherwise.
 *
 * Median cannot be computed incrementally from just a previous median +
 * count, so this helper keeps the underlying sorted data as state.
 */
export function insertIntoSortedAndGetMedian(
  sorted: number[],
  newValue: number,
): number {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if ((sorted[mid] as number) < newValue) lo = mid + 1;
    else hi = mid;
  }
  sorted.splice(lo, 0, newValue);

  return medianOfSorted(sorted);
}
