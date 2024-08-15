import { ImmerStateCreator } from "../type-helpers";
import { type Selection } from "@adobe/react-spectrum";

export type ContentState = {
  selectedRowIds: Selection;
  contentStorage: { [key: string]: IContent };
  categoryStorage: { [key: string]: ICategory };
  contentCursor: string;
  contentScrollPosition: number;
  rowIdForPreview?: string | null;
  activeContentId: string | null;
  activeContentDrafting: Partial<IContent>;
};

export interface IContent {
  id: string;
  categoryId: string;
  content: string;
  coverImage: string;
  created: string;
  metadata: { [key: string]: string };
  modified: string;
  slug: string;
  status: string;
  tags: string[];
  title: string;
  userId: string;
}

export interface ICategory {
  id: string;
  name: string;
  description: string;
  status: string;
  modified: string;
  created: string;
}

export type ContentAction = {
  setSelectedRowIds: (rowId: Selection) => void;
  clearSelectedRowIds: () => void;
  appendContents: (contents: IContent[]) => void;
  appendCategorioes: (categories: ICategory[]) => void;
  setContentCursor: (cursor: string) => void;
  setContentScrollPosition: (p: number) => void;
  setRowIdForPreview: (rowId: string) => void;
  clearRowPreview: () => void;
  setActiveContentId: (id: string | null) => void;
  setPartiallyDraftingContent: (content: Partial<IContent>) => void;
};

export type ContentSlice = ContentState & ContentAction;

export const defaultInitState: ContentState = {
  selectedRowIds: new Set<string>(),
  contentStorage: {},
  categoryStorage: {},
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
    appendContents: (contents: IContent[]) =>
      set((state) => {
        contents.forEach((c) => {
          state.contentStorage[c.id] = c;
        });
        // TODO fix this ugly sort
        state.contentStorage = Object.fromEntries(
          Object.entries(state.contentStorage).sort((a, b) => {
            return (
              new Date(b[1].modified).getTime() -
              new Date(a[1].modified).getTime()
            );
          }),
        );
      }),
    appendCategorioes: (categories: ICategory[]) =>
      set((state) => {
        categories.forEach((c) => {
          state.categoryStorage[c.id] = c;
        });
        // TODO fix this ugly sort
        state.categoryStorage = Object.fromEntries(
          Object.entries(state.categoryStorage).sort((a, b) => {
            return (
              new Date(b[1].modified).getTime() -
              new Date(a[1].modified).getTime()
            );
          }),
        );
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
  });
};
