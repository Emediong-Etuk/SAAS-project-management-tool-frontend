import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function buildUpstreamUrl(request: NextRequest) {
  if (!API_BASE) {
    return null;
  }

  return new URL(request.nextUrl.pathname + request.nextUrl.search, API_BASE);
}

async function proxy(request: NextRequest) {
  const upstreamUrl = buildUpstreamUrl(request);

  if (!upstreamUrl) {
    return NextResponse.json(
      { message: "Missing NEXT_PUBLIC_API_URL configuration" },
      { status: 500 },
    );
  }

  const headers = new Headers();

  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (["host", "content-length", "connection"].includes(lowerKey)) {
      return;
    }
    headers.set(key, value);
  });

  headers.set("x-forwarded-host", request.headers.get("host") ?? "");
  headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""));

  const method = request.method;
  const body = ["GET", "HEAD"].includes(method)
    ? undefined
    : await request.text();

  const upstreamResponse = await fetch(upstreamUrl, {
    method,
    headers,
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  upstreamResponse.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (
      ["content-length", "transfer-encoding", "connection"].includes(lowerKey)
    ) {
      return;
    }
    responseHeaders.set(key, value);
  });

  responseHeaders.set("Access-Control-Allow-Origin", "*");
  responseHeaders.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  responseHeaders.set(
    "Access-Control-Allow-Headers",
    "x-xsrf-token, Content-Type, Authorization",
  );

  const responseBody = await upstreamResponse.text();

  return new NextResponse(responseBody, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest) {
  return proxy(request);
}

export async function POST(request: NextRequest) {
  return proxy(request);
}

export async function PUT(request: NextRequest) {
  return proxy(request);
}

export async function PATCH(request: NextRequest) {
  return proxy(request);
}

export async function DELETE(request: NextRequest) {
  return proxy(request);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "x-xsrf-token, Content-Type, Authorization",
    },
  });
}
