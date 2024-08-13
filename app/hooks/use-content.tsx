import { useMainStore } from "@/stores/providers/main-store";
import { IContent } from "@/stores/slices/content";
import { useAsyncList, useCollator } from "@adobe/react-spectrum";

export const useContent = () => {
  const { appendContents, contentCursor, setContentCursor } = useMainStore(
    (state) => state,
  );
  const collator = useCollator({ numeric: true });
  // The loader
  const _list = useAsyncList<IContent>({
    async load({ signal, cursor }) {
      if (cursor) {
        cursor = cursor.replace(/^http:\/\//i, "https://");
      }

      const res = await fetch(cursor || contentCursor, { signal });

      const json: any = await res.json();

      setContentCursor(json.next);
      appendContents(json.results);

      return {
        items: [],
        cursor: json.next,
      };
    }
  });
  return _list;
};
