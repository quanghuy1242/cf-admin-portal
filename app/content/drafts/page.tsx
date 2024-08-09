"use client";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function ContentDraftsPage() {
  return <div>This is the draft list</div>;
});

export const runtime = "edge";
