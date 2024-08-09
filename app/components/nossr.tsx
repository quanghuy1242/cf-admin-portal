import dynamic from "next/dynamic";
import React, { ReactElement } from "react";

export const withNoSSR = (
  Component: React.FunctionComponent<any>,
  loading?: () => ReactElement,
) =>
  dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: loading || (() => <p>Loading...</p>),
  });
