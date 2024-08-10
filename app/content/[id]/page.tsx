"use client";

import { usePageMeta } from "@/app/hooks/pageMeta";
import { useMainStore } from "@/stores/providers/main-store";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function ContentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const setActiveContentId = useMainStore((s) => s.setActiveContentId);
  usePageMeta({ title: `Editing post with ID ${params.id}` });
  setActiveContentId(params.id);
  return <div>My Post: {params.id}</div>;
});

export const runtime = "edge";
