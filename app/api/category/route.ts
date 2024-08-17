import { withPagination } from "../helpers/pagination";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
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
  const categories = await getRequestContext().env.CONTENT.fetch(
    process.env.CONTENT_API + "/api/v1/categories?" + withPagination(page, pageSize),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (categories.status !== 200) {
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
  return Response.json(await categories.json());
};

export const runtime = "edge";
