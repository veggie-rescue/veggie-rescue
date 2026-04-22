import { calcMedian, calcStdDev } from '../utils/stats';

export type DeliveryFrequency = 'None' | 'Low' | 'Medium' | 'High';

export interface NonprofitDeliveryData {
  recipient: string;
  daysSinceLastDelivery: number | null;
  priorityLevel: number | null | undefined;
  totalPoundsThisMonth: number;
  totalDeliveriesThisMonth: number;
  deliveryFrequency: DeliveryFrequency;
  location: string | null | undefined;
}

export interface DeliveryQueueRecipient {
  foodRecipient: string;
  needScore: number;
  location: string | null;
  daysSinceLastDelivery: number | null;
}

interface MetricStats {
  median: number;
  std: number;
}

const FREQUENCY_SCORES: Record<DeliveryFrequency, number> = {
  None: 0,
  Low: 1,
  Medium: 2,
  High: 3,
};

const toFiniteNumberOrNull = (
  value: number | null | undefined,
): number | null => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return null;
  }

  return value;
};

const getFrequencyScore = (value: string): number | null => {
  if (value in FREQUENCY_SCORES) {
    return FREQUENCY_SCORES[value as DeliveryFrequency];
  }

  return null;
};

const getMetricStats = (values: number[]): MetricStats | null => {
  const finiteValues = values.filter((v) => Number.isFinite(v));
  if (finiteValues.length === 0) {
    return null;
  }

  return {
    median: calcMedian(finiteValues),
    std: calcStdDev(finiteValues),
  };
};

const getZScore = (value: number, stats: MetricStats | null): number => {
  if (!stats || stats.std === 0) {
    return 0;
  }

  return (value - stats.median) / stats.std;
};

const weightedAbove = (
  value: number | null | undefined,
  stats: MetricStats | null,
  weight: number,
): number => {
  const safeValue = toFiniteNumberOrNull(value);
  if (safeValue === null) {
    return 0;
  }

  return weight * Math.max(getZScore(safeValue, stats), 0);
};

const weightedBelow = (
  value: number | null | undefined,
  stats: MetricStats | null,
  weight: number,
): number => {
  const safeValue = toFiniteNumberOrNull(value);
  if (safeValue === null) {
    return 0;
  }

  return weight * Math.max(-getZScore(safeValue, stats), 0);
};

const roundNeedScore = (value: number): number => {
  return Number(value.toFixed(1));
};

const daysSortValue = (daysSinceLastDelivery: number | null): number => {
  return daysSinceLastDelivery ?? -1;
};

export const generateDeliveryQueue = (
  recipients: readonly NonprofitDeliveryData[],
): DeliveryQueueRecipient[] => {
  const daysStats = getMetricStats(
    recipients
      .map((r) => r.daysSinceLastDelivery)
      .filter((value): value is number => Number.isFinite(value)),
  );

  const priorityStats = getMetricStats(
    recipients
      .map((r) => r.priorityLevel)
      .filter((value): value is number => Number.isFinite(value)),
  );

  const poundsStats = getMetricStats(
    recipients
      .map((r) => r.totalPoundsThisMonth)
      .filter((value): value is number => Number.isFinite(value)),
  );

  const deliveriesStats = getMetricStats(
    recipients
      .map((r) => r.totalDeliveriesThisMonth)
      .filter((value): value is number => Number.isFinite(value)),
  );

  const frequencyStats = getMetricStats(
    recipients
      .map((r) => getFrequencyScore(r.deliveryFrequency))
      .filter((value): value is number => value !== null),
  );

  const hasAllScoringInputs = (
    recipient: NonprofitDeliveryData,
  ): recipient is NonprofitDeliveryData & {
    daysSinceLastDelivery: number;
    totalPoundsThisMonth: number;
    totalDeliveriesThisMonth: number;
  } => {
    return (
      Number.isFinite(recipient.daysSinceLastDelivery) &&
      Number.isFinite(recipient.totalPoundsThisMonth) &&
      Number.isFinite(recipient.totalDeliveriesThisMonth) &&
      getFrequencyScore(recipient.deliveryFrequency) !== null
    );
  };

  return recipients
    .filter(hasAllScoringInputs)
    .map((recipient) => {
      const weightedSum =
        weightedAbove(recipient.daysSinceLastDelivery, daysStats, 0.35) +
        weightedBelow(recipient.priorityLevel, priorityStats, 0.25) +
        weightedBelow(recipient.totalPoundsThisMonth, poundsStats, 0.2) +
        weightedBelow(
          recipient.totalDeliveriesThisMonth,
          deliveriesStats,
          0.15,
        ) +
        weightedBelow(
          getFrequencyScore(recipient.deliveryFrequency),
          frequencyStats,
          0.05,
        );

      return {
        foodRecipient: recipient.recipient,
        needScore: roundNeedScore(100 * weightedSum),
        location: recipient.location ?? null,
        daysSinceLastDelivery: recipient.daysSinceLastDelivery,
      };
    })
    .sort((a, b) => {
      if (b.needScore !== a.needScore) {
        return b.needScore - a.needScore;
      }

      const dayDiff =
        daysSortValue(b.daysSinceLastDelivery) -
        daysSortValue(a.daysSinceLastDelivery);
      if (dayDiff !== 0) {
        return dayDiff;
      }

      return a.foodRecipient.localeCompare(b.foodRecipient);
    })
    .slice(0, 5);
};
