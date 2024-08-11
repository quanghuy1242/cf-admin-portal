"use client";

import { usePageMeta } from "../hooks/pageMeta";
import { fetcher } from "../utils/swc";
import { Flex } from "@adobe/react-spectrum";
import useSWR, { Fetcher } from "swr";

export default function About() {
  usePageMeta({ title: "About" });
  const { data, error, isLoading } = useSWR(
    "/api/content",
    fetcher as Fetcher<{ [key: string]: string }, string>,
  );
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return <Flex>About us... {JSON.stringify(data)}</Flex>;
}

export const runtime = "edge";
