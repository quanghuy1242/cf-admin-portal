import { fetcher } from "../utils/swc";
import { ICategory } from "@/stores/slices/content";
import useSWR from "swr";

export const useCategories = () => {
  const { data, isLoading } = useSWR<ICategory[]>(
    "/api/category",
    (...args: any) => fetcher(args).then((r) => r.results),
  );
  return { data, isLoading };
};
