import { useMainStore } from "@/stores/providers/main-store";
import { PageMeta } from "@/stores/slices/app";
import { useEffect } from "react";

export const usePageMeta = (meta: Partial<PageMeta>) => {
  const setPageMeta = useMainStore((state) => state.setPageMeta);
  useEffect(() => {
    setPageMeta(meta);
  }, [meta, setPageMeta]);
};
