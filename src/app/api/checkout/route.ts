// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const selectedIds = formData.getAll("selectedIds");
  const customer = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
  };

  console.log("Order:", { selectedIds, customer });

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("cart", "[]", { path: "/" });
  res.cookies.set("cart-selected", "[]", { path: "/" });
  return res;
}