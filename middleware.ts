import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired({
  returnTo: "/",
});

export const runtime = "experimental-edge";
