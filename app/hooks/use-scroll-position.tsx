import { useMainStore } from "@/stores/providers/main-store";
import { RefObject, useCallback, useEffect } from "react";

export const useTrackingScroll: (refObj: RefObject<HTMLDivElement>) => void = (
  refObj,
) => {
  const { setContentScrollPosition, contentScrollPosition, clearRowPreview } =
    useMainStore((state) => state);
  const trackScrollPosition = useCallback(() => {
    const body = refObj.current?.querySelector('[role="rowgroup"]');
    body?.scrollTo({ top: contentScrollPosition });
    function onscroll() {
      const curr = body?.scrollTop || 0;
      setContentScrollPosition(curr);
    }
    body?.addEventListener("scroll", onscroll);
    return () => {
      body?.removeEventListener("scroll", onscroll);
    };
  }, []);

  useEffect(trackScrollPosition, []);
};
