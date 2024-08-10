import { AppSlice, AppState, createAppSlice } from "@/stores/slices/app";
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
