import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = req.cookies;
  const cartCookie = cookieStore.get("cart")?.value || "[]";
  const selectedCookie = cookieStore.get("cart-selected")?.value || "[]";

  let cart: { id: string; quantity: number }[] = JSON.parse(cartCookie);
  const selectedIds: string[] = JSON.parse(selectedCookie);

  cart = cart.filter((item) => !selectedIds.includes(item.id));

  const res = NextResponse.redirect(new URL("/cart", req.url));
  res.cookies.set("cart", JSON.stringify(cart), { path: "/" });
  res.cookies.set("cart-selected", "[]", { path: "/" });
  return res;
}