// src/app/api/cart/clear/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const redirect = formData.get("redirect") as string | null;
  const url = redirect ? new URL(redirect, req.url) : new URL("/", req.url);

  const res = NextResponse.redirect(url);
  res.cookies.set("cart", "[]", { path: "/" });
  res.cookies.set("cart-selected", "[]", { path: "/" });
  return res;
}