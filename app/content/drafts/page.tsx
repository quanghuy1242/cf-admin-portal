"use client";

import { usePageMeta } from "@/app/hooks/use-page-meta";

export default function ContentDraftsPage() {
  usePageMeta({ title: "Drafting contents" });
  return <div>This is the draft list</div>;
}

export const runtime = "edge";
