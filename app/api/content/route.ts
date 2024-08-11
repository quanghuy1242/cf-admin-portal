import { withPagination } from "../helpers/pagination";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0/edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "process";

export const GET = withApiAuthRequired(async (request: NextRequest) => {
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
    env.CONTENT_API +
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
  return Response.json({
    results: await contents.json(),
    next:
      page < pageCount
        ? "/api/content?" + withPagination(page, pageSize)
        : null,
  });
});

export const runtime = "edge";
