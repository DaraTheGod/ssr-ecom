// src/app/api/cart/remove/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const redirect = url.searchParams.get("redirect") || "/cart";

  if (!id) return NextResponse.redirect(new URL(redirect, req.url));

  const cartCookie = req.cookies.get("cart")?.value || "[]";
  let cart: { id: string; quantity: number }[] = JSON.parse(cartCookie);
  cart = cart.filter((c) => c.id !== id);

  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set("cart", JSON.stringify(cart), { path: "/" });
  return res;
}