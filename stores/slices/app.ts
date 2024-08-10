import { ImmerStateCreator } from "@/stores/type-helpers";

export type AppState = {
  count: number;
};

export type AppAction = {
  incrementCount: () => void;
};

export type AppSlice = AppState & AppAction;

export const defaultInitState: AppState = {
  count: 0,
};

export const createAppSlice: (arg0?: AppState) => ImmerStateCreator<AppSlice> =
  (initState: AppState = defaultInitState) =>
  (set) => ({
    ...initState,
    incrementCount: () =>
      set((state) => {
        state.count++;
      }),
  });
