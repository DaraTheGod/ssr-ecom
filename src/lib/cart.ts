import { cookies } from "next/headers";
import { Product } from "@/data/products";

export type CartItem = Product & { quantity: number };

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("ssr-shop-cart");
  if (!cartCookie?.value) return [];
  try {
    return JSON.parse(cartCookie.value);
  } catch {
    return [];
  }
}
