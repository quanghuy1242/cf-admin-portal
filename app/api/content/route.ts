import { withApiAuthRequired } from "@auth0/nextjs-auth0/edge";

export const GET = withApiAuthRequired((request: Request) => {
  return Response.json({ message: "This is nuts!" });
});

export const runtime = "edge";
