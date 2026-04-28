import { DataRow, SortDirection } from "../Table";

// Returns sorted rows
export function sortRows(data: DataRow[], sortDirection: SortDirection, sortKey: string | null) {
  if (sortKey === null) {
    return data;
  }

  return [...data].sort((leftRow, rightRow) => {
      const comparison = compareValues(leftRow[sortKey] ?? '', rightRow[sortKey] ?? '');

      return sortDirection === 'asc' ? comparison : -comparison;
  })
}

// Normalize data for sorting
function getSortableValue(value: string) {
  const trimmedValue = value.trim();
  const numericValue = Number(trimmedValue);

  if (!Number.isNaN(numericValue) && Number.isFinite(numericValue)) {
    return numericValue;
  }
  else {
    return trimmedValue.toLowerCase();
  }
}

// Compare 2 data points
export function compareValues(left: string, right: string) {
  const leftValue = getSortableValue(left);
  const rightValue = getSortableValue(right);

  if (typeof leftValue === 'number' && typeof rightValue === 'number') {
    return leftValue - rightValue;
  }

  return String(leftValue).localeCompare(String(rightValue), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

