"use client";

import { Content, Heading, IllustratedMessage } from "@adobe/react-spectrum";
import IconNotFound from "@spectrum-icons/illustrations/NotFound";

export const runtime = "edge";

export default function NotFound() {
  return (
    <>
      <IllustratedMessage>
        <IconNotFound />
        <Heading>Error 404: Page not found</Heading>
        <Content>
          This page is not available. Try checking the URL or visit a different
          page.
        </Content>
      </IllustratedMessage>
    </>
  );
}
