import { AppSlice, AppState, createAppSlice } from "./app-store";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

export type MainStore = AppSlice;

export const createMainStore = (initAppState?: AppState) => {
  return createStore<MainStore>()(
    immer((...a) => ({
      ...createAppSlice(initAppState)(...a),
    })),
  );
};
