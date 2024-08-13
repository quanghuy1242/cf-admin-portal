import { ImmerStateCreator } from "@/stores/type-helpers";

export type PageMeta = {
  title: string;
};

export type AppState = {
  count: number;
  pageMeta: PageMeta;
  collapsedSidenav: boolean;
  isOpenedSidenav: boolean;
};

export type AppAction = {
  incrementCount: () => void;
  setPageMeta: (meta: Partial<PageMeta>) => void;
  resetPageMeta: () => void;
  setCollapsedSidenav: (shouldCollapsable: boolean) => void;
  setSidenavStatus: (status: boolean) => void;
};

export type AppSlice = AppState & AppAction;

export const defaultInitState: AppState = {
  count: 0,
  pageMeta: { title: "admin.quanghuy.dev" },
  collapsedSidenav: false,
  isOpenedSidenav: false,
};

export const createAppSlice: (arg0?: AppState) => ImmerStateCreator<AppSlice> =
  (initState: AppState = defaultInitState) =>
  (set) => ({
    ...initState,
    incrementCount: () =>
      set((state) => {
        state.count++;
      }),
    setPageMeta: (meta: Partial<PageMeta>) =>
      set((state) => {
        let t: keyof PageMeta;
        for (t in meta) {
          const v = meta[t];
          if (v) {
            state.pageMeta[t] = v;
          }
        }
      }),
    resetPageMeta: () =>
      set((state) => {
        state.pageMeta = initState.pageMeta;
      }),
    setCollapsedSidenav: (shouldCollapsable: boolean) =>
      set((state) => {
        state.collapsedSidenav = shouldCollapsable;
      }),
    setSidenavStatus: (status: boolean) =>
      set((state) => {
        state.isOpenedSidenav = status;
      }),
  });
