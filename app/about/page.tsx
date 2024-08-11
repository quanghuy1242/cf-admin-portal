"use client";

import { usePageMeta } from "../hooks/use-page-meta";
import { Flex } from "@adobe/react-spectrum";

export default function About() {
  usePageMeta({ title: "About" });
  return <Flex>About us</Flex>;
}

export const runtime = "edge";
