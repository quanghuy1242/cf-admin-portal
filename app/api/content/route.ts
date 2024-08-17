import { withPagination } from "../helpers/pagination";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  // Extract wanted page and pageSize
  const params = new URLSearchParams(new URL(request.url).search);
  const page = Number.parseInt(params.get("page") || "1");
  const pageSize = Number.parseInt(params.get("pageSize") || "10");

  // Grab the access token
  const response = new NextResponse();
  const session = await getSession(request, response);
  if (!session) {
    return Response.json({ message: "Bad" }, { status: 401 });
  }
  const { user, accessToken } = session;
  const contents = await getRequestContext().env.CONTENT.fetch(
    process.env.CONTENT_API +
      "/api/v1/contents?" +
      withPagination(page, pageSize) +
      `&userId=${user.sub}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (response.status !== 200) {
    return Response.json(
      {
        message: "There something wrong",
        error: await contents.json(),
      },
      {
        status: 400,
      },
    );
  }

  // Calculate for the next one
  const pageCount = Number.parseInt(
    contents.headers.get("x-page-count") || "1",
  );
  return Response.json(await contents.json());
};

export const POST = async (request: NextRequest) => {
  // Grab the access token
  const response = new NextResponse();
  const session = await getSession(request, response);
  if (!session) {
    return Response.json({ message: "Bad" }, { status: 401 });
  }
  const { user, accessToken } = session;
  const body: object = await request.json();
  const content = await getRequestContext().env.CONTENT.fetch(
    process.env.CONTENT_API + "/api/v1/contents",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        meta: { twitterCard: "abc" },
        userId: user.sub,
        status: "ACTIVE"
      }),
    },
  );
  if (content.status !== 201) {
    return Response.json(
      {
        message: "There something wrong",
        error: await content.json(),
      },
      {
        status: 400,
      },
    );
  }
  return Response.json(await content.json());
};

export const runtime = "edge";
