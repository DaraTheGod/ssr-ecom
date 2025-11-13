import { NextRequest, NextResponse } from "next/server";

async function handleRemoveSelected(req: NextRequest) {
  const url = new URL(req.url);
  const redirect = url.searchParams.get("redirect") || "/cart";

  const cartCookie = req.cookies.get("cart")?.value || "[]";
  const selectedCookie = req.cookies.get("cart-selected")?.value || "[]";

  let cart: { id: string; quantity: number }[] = JSON.parse(cartCookie);
  const selectedIds: string[] = JSON.parse(selectedCookie);

  cart = cart.filter((c) => !selectedIds.includes(c.id));

  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set("cart", JSON.stringify(cart), { path: "/" });
  res.cookies.set("cart-selected", "[]", { path: "/" });
  return res;
}

export async function GET(req: NextRequest) {
  return handleRemoveSelected(req);
}

export async function POST(req: NextRequest) {
  return handleRemoveSelected(req);
}