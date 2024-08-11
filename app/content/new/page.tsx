"use client";

import { usePageMeta } from "@/app/hooks/use-page-meta";
import { useMainStore } from "@/stores/providers/main-store";

export default function ContentDraftsPage() {
  usePageMeta({ title: "Create a new content" });
  const setActiveContentId = useMainStore((s) => s.setActiveContentId);
  setActiveContentId(null);
  return (
    <div>Feel free to add things you need to post! Ah yeah, you can&apos;t</div>
  );
}

export const runtime = "edge";
