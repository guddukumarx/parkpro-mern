// src/hooks/useFetch.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for data fetching with loading, error, and refetch capabilities.
 *
 * @param {Function} fetchFn - Async function that returns the data.
 * @param {Array} deps - Dependencies array to trigger re-fetch when changed.
 * @param {Object} options - Optional configuration.
 * @param {boolean} options.enabled - Whether to fetch initially (default: true).
 * @param {Function} options.onSuccess - Callback on successful fetch.
 * @param {Function} options.onError - Callback on error.
 * @returns {Object} { data, loading, error, refetch }
 */
const useFetch = (fetchFn, deps = [], options = {}) => {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const isMounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const executeFetch = useCallback(
    async (isManual = false) => {
      // Cancel previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (!isManual) setLoading(true);
      setError(null);

      try {
        const result = await fetchFn({ signal: controller.signal });
        if (isMounted.current && !controller.signal.aborted) {
          setData(result);
          if (onSuccess) onSuccess(result);
        }
      } catch (err) {
        if (isMounted.current && !controller.signal.aborted) {
          setError(err.message || 'Something went wrong');
          if (onError) onError(err);
        }
      } finally {
        if (isMounted.current && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [fetchFn, onSuccess, onError]
  );

  // Initial fetch and dependency-triggered fetch
  useEffect(() => {
    if (!enabled) return;
    executeFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const refetch = useCallback(() => executeFetch(true), [executeFetch]);

  return { data, loading, error, refetch };
};

export default useFetch;