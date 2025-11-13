import { NextRequest, NextResponse } from "next/server";

async function handleClear(req: NextRequest) {
  const url = new URL(req.url);
  const redirect = url.searchParams.get("redirect") || "/";

  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set("cart", "[]", { path: "/" });
  res.cookies.set("cart-selected", "[]", { path: "/" });
  return res;
}

export async function GET(req: NextRequest) {
  return handleClear(req);
}

export async function POST(req: NextRequest) {
  return handleClear(req);
}