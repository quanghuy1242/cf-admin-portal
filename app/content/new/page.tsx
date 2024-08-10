"use client";

import { usePageMeta } from "@/app/hooks/pageMeta";
import { useMainStore } from "@/stores/providers/main-store";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function ContentDraftsPage() {
  usePageMeta({ title: "Create a new content" });
  const setActiveContentId = useMainStore((s) => s.setActiveContentId);
  setActiveContentId(null);
  return (
    <div>Feel free to add things you need to post! Ah yeah, you can&apos;t</div>
  );
});

export const runtime = "edge";
