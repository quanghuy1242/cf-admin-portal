import {
  createContent,
  fetchContent,
  fetchContents,
  updateContent,
} from "@/services/contents";
import { IContentCreate, IContentUpdate } from "@/types/content";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export enum ContentQueryKey {
  infContents = "infContents",
  contents = "contents",
  content = "content",
}

export const useInfContent = () => {
  const {
    data,
    isFetchingNextPage,
    status,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [ContentQueryKey.infContents],
    queryFn: async ({ pageParam }) =>
      await fetchContents({ page: pageParam, pageSize: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (lastPage.length === 0) return undefined;
      return lastPageParam + 1;
    },
  });
  return {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    status,
    fetchNextPage: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  };
};

export const useContent = (id: string) => {
  const { data, isFetching } = useQuery({
    queryKey: [ContentQueryKey.content, id],
    queryFn: () => fetchContent(id),
  });
  return { data, isFetching };
};

export const usePrefetchContent = () => {
  const queryClient = useQueryClient();
  return async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: [ContentQueryKey.content, id],
      queryFn: () => fetchContent(id),
    });
  };
};

export const useContentUpdate = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({
      id,
      content,
    }: {
      id: string;
      content: Partial<IContentUpdate>;
    }) => {
      return updateContent(id, content);
    },
    onSettled: async (data, err, { id, content }) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: [ContentQueryKey.infContents],
        }),
        queryClient.invalidateQueries({
          queryKey: [ContentQueryKey.content, id],
        }),
      ]);
    },
  });
  return {
    mutate: mutateAsync,
  };
};

export const useContentCreate = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ content }: { content: IContentCreate }) => {
      return createContent(content);
    },
    onSettled: async (data, err, { content }) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: [ContentQueryKey.infContents],
        }),
      ]);
    },
  });
  return {
    mutate: mutateAsync,
  };
};
