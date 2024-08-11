import { withPagination } from "../helpers/pagination";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0/edge";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "process";

export const GET = withApiAuthRequired(async (request: NextRequest) => {
  // Extract wanted page and pageSize
  const params = new URLSearchParams(new URL(request.url).search);
  const page = Number.parseInt(params.get("page") || "1");
  const pageSize = Number.parseInt(params.get("pageSize") || "100");

  // Grab the access token
  const response = new NextResponse();
  const session = await getSession(request, response);
  if (!session) {
    return Response.json({ message: "Bad" }, { status: 401 });
  }
  const { accessToken } = session;
  const categories = await fetch(
    env.CONTENT_API + "/categories?" + withPagination(page, pageSize),
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
        error: await categories.json(),
      },
      {
        status: 400,
      },
    );
  }
  return Response.json({
    results: await categories.json(),
    next: null,
  });
});

export const runtime = "edge";
