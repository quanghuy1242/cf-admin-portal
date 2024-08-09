"use client";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(
  function ContentDetailPage({ params }: { params: { id: string } }) {
    return <div>My Post: {params.id}</div>;
  }
)

export const runtime = "edge";
