import { fetcher } from "../utils/swc";
import { useMainStore } from "@/stores/providers/main-store";
import { ICategory } from "@/stores/slices/content";
import { useEffect } from "react";
import useSWR from "swr";

export const useCategories = () => {
  const { appendCategorioes, categoryStorage } = useMainStore((state) => state);
  const { data: categories } = useSWR(
    Object.keys(categoryStorage).length === 0 ? "/api/category" : null,
    fetcher,
  );

  useEffect(() => {
    if (categories) {
      appendCategorioes((categories as any).results as ICategory[]);
    }
  }, [appendCategorioes, categories]);
};
