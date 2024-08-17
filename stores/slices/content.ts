import { ImmerStateCreator } from "../type-helpers";
import { IContent } from "@/types/content";
import { type Selection } from "@adobe/react-spectrum";

export type ContentState = {
  selectedRowIds: Selection;
  contentCursor: string;
  contentScrollPosition: number;
  rowIdForPreview?: string | null;
  activeContentId: string | null;
  activeContentDrafting: Partial<IContent>;
};

export type ContentAction = {
  setSelectedRowIds: (rowId: Selection) => void;
  clearSelectedRowIds: () => void;
  setContentCursor: (cursor: string) => void;
  setContentScrollPosition: (p: number) => void;
  setRowIdForPreview: (rowId: string) => void;
  clearRowPreview: () => void;
  setActiveContentId: (id: string | null) => void;
  setPartiallyDraftingContent: (content: Partial<IContent>) => void;
  clearDraftedContent: () => void;
};

export type ContentSlice = ContentState & ContentAction;

export const defaultInitState: ContentState = {
  selectedRowIds: new Set<string>(),
  contentCursor: "/api/content",
  contentScrollPosition: 0,
  activeContentId: null,
  activeContentDrafting: {},
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
    setPartiallyDraftingContent: (content: Partial<IContent>) =>
      set((state) => {
        let t: keyof IContent;
        for (t in content) {
          const v: any = content[t];
          if (v) {
            state.activeContentDrafting[t] = v;
          }
        }
      }),
    clearDraftedContent: () =>
      set((state) => {
        state.activeContentDrafting = defaultInitState.activeContentDrafting;
      }),
  });
};
