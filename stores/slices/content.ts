import { ImmerStateCreator } from "../type-helpers";
import { type Selection } from "@adobe/react-spectrum";

export type ContentState = {
  selectedRowIds: Selection;
  contentStorage: Character[];
  contentCursor: string;
  contentScrollPosition: number;
  rowIdForPreview?: string | null;
  activeContentId: string | null;
};

export interface Character {
  name: string;
  height: number;
  birth_year: number;
}

export type ContentAction = {
  setSelectedRowIds: (rowId: Selection) => void;
  clearSelectedRowIds: () => void;
  appendContents: (contents: Character[]) => void;
  setContentCursor: (cursor: string) => void;
  setContentScrollPosition: (p: number) => void;
  setRowIdForPreview: (rowId: string) => void;
  clearRowPreview: () => void;
  setActiveContentId: (id: string | null) => void;
};

export type ContentSlice = ContentState & ContentAction;

export const defaultInitState: ContentState = {
  selectedRowIds: new Set<string>(),
  contentStorage: [],
  contentCursor: "https://swapi.py4e.com/api/people/?search=",
  contentScrollPosition: 0,
  activeContentId: null,
};

export const createContentSlice: (
  args?: ContentState,
) => ImmerStateCreator<ContentSlice> = (
  initState: ContentState = defaultInitState,
) => {
  return (set) => ({
    ...initState,
    setSelectedRowIds: (rowIds: Selection) =>
      set((state) => {
        state.selectedRowIds = rowIds;
      }),
    clearSelectedRowIds: () =>
      set((state) => {
        state.selectedRowIds = defaultInitState.selectedRowIds;
      }),
    appendContents: (contents: Character[]) =>
      set((state) => {
        state.contentStorage.push(...contents);
      }),
    setContentCursor: (cursor: string) =>
      set((state) => {
        state.contentCursor = cursor;
      }),
    setContentScrollPosition: (p: number) =>
      set((state) => {
        state.contentScrollPosition = p;
      }),
    setRowIdForPreview: (rowId: string) =>
      set((state) => {
        state.rowIdForPreview = rowId;
      }),
    clearRowPreview: () =>
      set((state) => {
        state.rowIdForPreview = null;
      }),
    setActiveContentId: (id: string | null) =>
      set((state) => {
        state.activeContentId = id;
      }),
  });
};
