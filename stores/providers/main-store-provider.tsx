"use client";

import { createMainStore, type MainStore } from "..";
import { createContext, ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

export type MainStoreAPI = ReturnType<typeof createMainStore>;

export const MainStoreContext = createContext<MainStoreAPI | undefined>(
  undefined,
);

export interface MainStoreProviderProps {
  children: ReactNode;
}

export const MainStoreProvider = ({ children }: MainStoreProviderProps) => {
  const storeRef = useRef<MainStoreAPI>();
  if (!storeRef.current) {
    storeRef.current = createMainStore();
  }
  return (
    <MainStoreContext.Provider value={storeRef.current}>
      {children}
    </MainStoreContext.Provider>
  );
};

export const useMainStore = <T,>(selector: (store: MainStore) => T): T => {
  const mainStoreCtx = useContext(MainStoreContext);
  if (!mainStoreCtx) {
    throw new Error("useStore must be used within MainStoreContext");
  }
  return useStore(mainStoreCtx, selector);
};
