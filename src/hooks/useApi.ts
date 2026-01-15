// ============================================
// API Hook for Data Fetching
// ============================================

import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  setData: (data: T | null) => void;
}

/**
 * Hook for API calls with loading and error states
 */
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
    } catch (error: any) {
      setState({ data: null, loading: false, error: error.message || 'An error occurred' });
    }
  }, [apiFunction]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    refetch: fetchData,
    setData,
  };
}

/**
 * Hook for manual API calls (not auto-fetching)
 */
export function useApiMutation<T, P = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiFunction: (params: P) => Promise<T>, params: P) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const result = await apiFunction(params);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}