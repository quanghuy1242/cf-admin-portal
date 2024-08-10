"use client";

import { usePageMeta } from "../hooks/pageMeta";
import { fetcher } from "../utils/swc";
import { Flex } from "@adobe/react-spectrum";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import useSWR, { Fetcher } from "swr";

export default withPageAuthRequired(
  function About() {
    usePageMeta({ title: "About" });
    const { data, error, isLoading } = useSWR(
      "/api/content",
      fetcher as Fetcher<{ message: string }, string>,
    );
    if (error) return <div>failed to load</div>;
    if (isLoading) return <div>loading...</div>;
    return <Flex>About us... {data?.message}</Flex>;
  },
  { returnTo: "/" },
);

export const runtime = "edge";
