'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// Google Sheets API response format
export interface SheetData {
  range: string;
  majorDimension: string;
  values: string[][];
}

interface TableDataState {
  data: SheetData | null;
  isLoading: boolean;
  error: string | null;
}

interface TableDataContextValue extends TableDataState {
  fetchData: () => Promise<void>;
  updateData: (rows: string[][]) => Promise<void>;
}

const STORAGE_KEY = 'veggie-rescue-table-data';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const TableDataContext = createContext<TableDataContextValue | null>(null);

function loadFromStorage(): SheetData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data: SheetData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export function TableDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TableDataState>(() => ({
    data: loadFromStorage(),
    isLoading: false,
    error: null,
  }));

  const fetchData = useCallback(async () => {
    const cachedData = loadFromStorage();
    if (cachedData) {
      setState({ data: cachedData, isLoading: true, error: null });
    } else {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/sheets`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const json = await response.json();
      const sheetData: SheetData = json.data;

      saveToStorage(sheetData);
      setState({ data: sheetData, isLoading: false, error: null });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch data';
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  }, []);

  const updateData = useCallback(async (rows: string[][]) => {
    // Capture previous data for rollback
    let previousData: SheetData | null = null;

    setState((prev) => {
      previousData = prev.data;
      if (!prev.data) return prev;

      // Optimistic update
      const optimisticData: SheetData = { ...prev.data, values: rows };
      saveToStorage(optimisticData);
      return { data: optimisticData, isLoading: false, error: null };
    });

    try {
      const currentData = loadFromStorage();
      if (!currentData) return;

      const response = await fetch(`${API_BASE_URL}/sheets`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentData, values: rows }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update: ${response.statusText}`);
      }
    } catch (err) {
      // Rollback to previous state and show error
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update data';
      setState({
        data: previousData,
        isLoading: false,
        error: errorMessage,
      });

      // Restore localStorage to previous state
      if (previousData) {
        saveToStorage(previousData);
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      fetchData,
      updateData,
    }),
    [state, fetchData, updateData]
  );

  return (
    <TableDataContext.Provider value={value}>
      {children}
    </TableDataContext.Provider>
  );
}

export function useTableData(): TableDataContextValue {
  const context = useContext(TableDataContext);
  if (!context) {
    throw new Error('useTableData must be used within a TableDataProvider');
  }
  return context;
}
