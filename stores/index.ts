import {
  ContentSlice,
  ContentState,
  createContentSlice,
} from "./slices/content";
import { AppSlice, AppState, createAppSlice } from "@/stores/slices/app";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

export type MainStore = AppSlice & ContentSlice;

export const createMainStore = (
  initAppState?: AppState,
  initContentSlice?: ContentState,
) => {
  return createStore<MainStore>()(
    immer((...a) => ({
      ...createAppSlice(initAppState)(...a),
      ...createContentSlice(initContentSlice)(...a),
    })),
  );
};
