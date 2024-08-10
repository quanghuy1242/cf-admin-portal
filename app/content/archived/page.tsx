"use client";

import { usePageMeta } from "@/app/hooks/pageMeta";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function ContentDraftsPage() {
  usePageMeta({ title: "Archived content" });
  return (
    <div>
      List of archived content, you can restore them to the active content
    </div>
  );
});

export const runtime = "edge";
