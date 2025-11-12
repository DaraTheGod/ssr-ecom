import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { products } from "@/data/products";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  let qty = parseInt(url.searchParams.get("qty") || "1", 10);
  const redirect = url.searchParams.get("redirect") || "/";

  if (!id || isNaN(qty)) return NextResponse.redirect(new URL("/", req.url));
  if (!products.find((p) => p.id === id)) return NextResponse.redirect(new URL("/", req.url));

  const cookieStore = await cookies();
  let cart: { id: string; quantity: number }[] = [];
  const existing = cookieStore.get("cart")?.value;
  if (existing) {
    try {
      cart = JSON.parse(existing);
    } catch {}
  }

  const index = cart.findIndex((i) => i.id === id);
  if (index !== -1) {
    cart[index].quantity += qty;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
  } else if (qty > 0) {
    cart.push({ id, quantity: qty });
  }

  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set("cart", JSON.stringify(cart), { path: "/" });
  return res;
}