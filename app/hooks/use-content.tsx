import { fetcher } from "../utils/swc";
import { useMainStore } from "@/stores/providers/main-store";
import { IContent } from "@/stores/slices/content";
import { useAsyncList } from "@adobe/react-spectrum";
import useSWR, { unstable_serialize, useSWRConfig } from "swr";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import useSWRMutation from "swr/mutation";

export const useContentt = () => {
  const { appendContents, contentCursor, setContentCursor } = useMainStore(
    (state) => state,
  );
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
    },
  });
  return _list;
};

export const getKey: SWRInfiniteKeyLoader = (
  pageIndex: number,
  previousPageData: any,
) => {
  if (previousPageData && !previousPageData.next) {
    return null;
  }
  if (pageIndex === 0) {
    return "/api/content";
  }
  return previousPageData.next;
};

export const useInfContents = () => {
  const { data, size, setSize, isLoading } = useSWRInfinite<IContent[]>(
    getKey,
    (...args) => fetcher(args).then((r) => r.results),
  );
  return {
    data,
    isLoading,
    loadMore: () => setSize(size),
  };
};

export const useInfContentsUpdate = () => {
  const { mutate } = useSWRConfig();
  return (data: IContent[]) =>
    mutate(unstable_serialize(getKey), undefined, {
      revalidate: false,
      populateCache: (n, c) => [...c, n, ...data],
    });
};

export const useContent = (id: string, cache?: IContent) => {
  const { data, isLoading, mutate } = useSWR<IContent>(
    "/api/content/" + id,
    fetcher,
    { fallbackData: cache },
  );
  return { data, isLoading, mutate };
};

export const useContentUpdate = (id: string) => {
  const { trigger } = useSWRMutation(
    "/api/content/" + id,
    async (url: string, { arg }: { arg: Partial<IContent> }) => {
      const d = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(arg),
      });
      return (await d.json()) as IContent;
    },
    { revalidate: false },
  );
  return trigger;
};
