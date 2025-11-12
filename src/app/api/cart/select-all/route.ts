import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const action = formData.get("action") as string;
  const redirect = (formData.get("redirect") as string) || "/cart";

  const cookieStore = req.cookies;
  const cartCookie = cookieStore.get("cart")?.value || "[]";
  const cart = JSON.parse(cartCookie) as { id: string }[];

  const selectedIds = action === "select" ? cart.map((i) => i.id) : [];

  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set("cart-selected", JSON.stringify(selectedIds), { path: "/" });
  return res;
}