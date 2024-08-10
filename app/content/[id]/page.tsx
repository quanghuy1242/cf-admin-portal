"use client";

import { usePageMeta } from "@/app/hooks/pageMeta";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function ContentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  usePageMeta({ title: `Editing post with ID ${params.id}` });
  return <div>My Post: {params.id}</div>;
});

export const runtime = "edge";
