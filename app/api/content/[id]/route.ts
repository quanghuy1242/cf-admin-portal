import { getSession } from "@auth0/nextjs-auth0/edge";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextRequest, NextResponse } from "next/server";
import { env } from "process";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Grab the access token
  const response = new NextResponse();
  const session = await getSession(request, response);
  if (!session) {
    return Response.json({ message: "Bad" }, { status: 401 });
  }
  const { accessToken } = session;
  const content = await getRequestContext().env.CONTENT.fetch(
    env.CONTENT_API + "/api/v1/contents/" + params.id,
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
        error: await content.json(),
      },
      {
        status: 400,
      },
    );
  }
  return Response.json(await content.json());
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  // Grab the access token
  const response = new NextResponse();
  const session = await getSession(request, response);
  if (!session) {
    return Response.json({ message: "Bad" }, { status: 401 });
  }
  const { accessToken } = session;
  const content = await getRequestContext().env.CONTENT.fetch(
    env.CONTENT_API + "/api/v1/contents/" + params.id,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(await request.json()),
    },
  );
  if (response.status !== 200) {
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
}

export const runtime = "edge";
