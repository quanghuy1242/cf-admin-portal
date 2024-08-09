import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import { sync } from "glob";

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@adobe/react-spectrum",
    "@react-spectrum/*",
    "@spectrum-icons/*",
    "@spectrum-css/*",
  ].flatMap((spec) => sync(`${spec}`, { cwd: "node_modules/" })),
};

export default nextConfig;
