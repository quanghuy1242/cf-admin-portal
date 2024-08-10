"use client";

import { usePageMeta } from "@/app/hooks/pageMeta";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function ContentDraftsPage() {
  usePageMeta({ title: "Drafting contents" });
  return <div>This is the draft list</div>;
});

export const runtime = "edge";
