"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { AppState, appReducer, initialState } from "./reducer";
import { AppAction } from "./actions";

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppStateContext = createContext<AppContextType | undefined>(undefined);



import { createClient } from "../lib/supabase/client";

const supabase = createClient();

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Load state from Supabase on mount
  useEffect(() => {
    const fetchState = async () => {
      try {
        const { data, error } = await supabase
          .from("app_state")
          .select("data")
          .eq("id", "global-demo-state")
          .single();
          
        if (data && data.data) {
          dispatch({ type: "SET_FULL_STATE", payload: data.data as AppState });
        } else if (error) {
          console.error("Failed to load state from Supabase:", error);
        }
      } catch (error) {
        console.error("Failed to load state from Supabase:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    fetchState();
  }, []);

  // Save state to Supabase whenever it changes (after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    const saveState = async () => {
      try {
        await supabase
          .from("app_state")
          .upsert({ id: "global-demo-state", data: state });
      } catch (error) {
        console.error("Failed to save state to Supabase:", error);
      }
    };
    
    saveState();
  }, [state, isInitialized]);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading Medical Network...</div>;
  }

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
