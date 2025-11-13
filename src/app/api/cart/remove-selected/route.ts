// src/app/api/cart/remove-selected/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const redirect = formData.get("redirect") as string | null;
  const url = redirect ? new URL(redirect, req.url) : new URL("/cart", req.url);

  const cartCookie = req.cookies.get("cart")?.value || "[]";
  const selectedCookie = req.cookies.get("cart-selected")?.value || "[]";

  let cart: { id: string; quantity: number }[] = JSON.parse(cartCookie);
  const selectedIds: string[] = JSON.parse(selectedCookie);

  cart = cart.filter((c) => !selectedIds.includes(c.id));

  const res = NextResponse.redirect(url);
  res.cookies.set("cart", JSON.stringify(cart), { path: "/" });
  res.cookies.set("cart-selected", "[]", { path: "/" });
  return res;
}