"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { AppState, appReducer, initialState } from "./reducer";
import { AppAction } from "./actions";

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppStateContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "patient_sovereign_state";

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with a lazy initializer to load from localStorage
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.error("Failed to load state from local storage:", error);
      }
    }
    return initial;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to local storage:", error);
    }
  }, [state]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
