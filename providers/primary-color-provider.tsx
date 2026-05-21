"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  DEFAULT_PRIMARY_COLOR,
  PRIMARY_COLOR_STORAGE_KEY,
  PRIMARY_COLORS,
  PrimaryColor,
  isPrimaryColor,
} from "@/config/primary-colors";

type PrimaryColorContextValue = {
  colors: typeof PRIMARY_COLORS;
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
};

const PrimaryColorContext = createContext<PrimaryColorContextValue | null>(null);
const PRIMARY_COLOR_CHANGE_EVENT = "primary-color-change";

function applyPrimaryColor(color: PrimaryColor) {
  document.documentElement.dataset.primary = color;
}

function getStoredPrimaryColor(): PrimaryColor {
  const storedColor = localStorage.getItem(PRIMARY_COLOR_STORAGE_KEY);

  return isPrimaryColor(storedColor) ? storedColor : DEFAULT_PRIMARY_COLOR;
}

function getServerSnapshot() {
  return DEFAULT_PRIMARY_COLOR;
}

function subscribeToPrimaryColor(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PRIMARY_COLOR_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PRIMARY_COLOR_CHANGE_EVENT, callback);
  };
}

export function PrimaryColorProvider({ children }: { children: React.ReactNode }) {
  const primaryColor = useSyncExternalStore(
    subscribeToPrimaryColor,
    getStoredPrimaryColor,
    getServerSnapshot
  );

  useEffect(() => {
    applyPrimaryColor(primaryColor);
  }, [primaryColor]);

  const setPrimaryColor = useCallback((color: PrimaryColor) => {
    applyPrimaryColor(color);
    localStorage.setItem(PRIMARY_COLOR_STORAGE_KEY, color);
    window.dispatchEvent(new Event(PRIMARY_COLOR_CHANGE_EVENT));
  }, []);

  const value = useMemo(
    () => ({
      colors: PRIMARY_COLORS,
      primaryColor,
      setPrimaryColor,
    }),
    [primaryColor, setPrimaryColor]
  );

  return (
    <PrimaryColorContext.Provider value={value}>
      {children}
    </PrimaryColorContext.Provider>
  );
}

export function usePrimaryColor() {
  const context = useContext(PrimaryColorContext);

  if (!context) {
    throw new Error("usePrimaryColor must be used within PrimaryColorProvider");
  }

  return context;
}
