"use client";

import { usePageMeta } from "@/app/hooks/pageMeta";

export default function ContentDraftsPage() {
  usePageMeta({ title: "Archived content" });
  return (
    <div>
      List of archived content, you can restore them to the active content
    </div>
  );
}

export const runtime = "edge";
