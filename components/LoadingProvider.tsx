"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface LoadingContextValue {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return ctx;
}

export default function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const setIsLoading = useCallback((loading: boolean) => setLoading(loading), []);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          aria-live="polite"
          aria-busy="true"
        >
          <div
            className="h-12 w-12 rounded-full border-4 border-white border-t-transparent animate-spin"
            role="status"
            aria-label="Loading"
          />
        </div>
      )}
    </LoadingContext.Provider>
  );
}
