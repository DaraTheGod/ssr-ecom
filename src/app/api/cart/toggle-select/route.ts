import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const id = formData.get("id") as string;
  const redirect = (formData.get("redirect") as string) || "/cart";

  const cookieStore = req.cookies;
  const selectedCookie = cookieStore.get("cart-selected")?.value || "[]";
  let selected: string[] = JSON.parse(selectedCookie);

  if (selected.includes(id)) {
    selected = selected.filter((s) => s !== id);
  } else {
    selected.push(id);
  }

  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set("cart-selected", JSON.stringify(selected), { path: "/" });
  return res;
}