import { useMainStore } from "@/stores/providers/main-store";
import { ICategory } from "@/stores/slices/content";
import { useEffect } from "react";

export const useCategories = () => {
  const { appendCategorioes, categoryStorage } = useMainStore((state) => state);
  useEffect(() => {
    async function fetchCate() {
      if (!Object.keys(categoryStorage).length) {
        const categories = await fetch("/api/category");
        const results = await categories.json();
        appendCategorioes((results as any).results as ICategory[]);
      }
    }
    fetchCate();
  }, [appendCategorioes, categoryStorage]);
};
