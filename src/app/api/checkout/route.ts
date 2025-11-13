import { NextRequest, NextResponse } from "next/server";

function crc16(input: string): string {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const selectedIds = formData.getAll("selectedIds") as string[];
  const total = Number(formData.get("total"));
  const deliveryOption = formData.get("deliveryOption") as string;

  // ✅ Determine delivery fee
  let deliveryFee = 0;
  if (deliveryOption === "standard") deliveryFee = 3.0;
  else if (deliveryOption === "express") deliveryFee = 6.0;
  else if (deliveryOption === "pickup") deliveryFee = 0;

  const grandTotal = total + deliveryFee; // ✅ Final total

  if (!selectedIds.length || isNaN(total) || total <= 0) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const customer = {
    firstName: formData.get("firstName"),
    phone: formData.get("phone"),
    street: formData.get("street"),
    commune: formData.get("commune"),
    district: formData.get("district"),
    province: formData.get("province"),
    deliveryOption,
    deliveryNotes: formData.get("deliveryNotes"),
  };

  console.log("Order:", { selectedIds, total, deliveryFee, grandTotal, customer });

  // ────── KHQR PAYLOAD ──────
  const merchantId = "chhinchheang_dara@wing";
  const merchantName = "Chhinchheang Dara";
  const merchantCity = "Phnom Penh";
  const trxId = `TRX${Date.now()}`;
  const amountStr = grandTotal.toFixed(2); // ✅ use grand total

  const tag00 = `00${merchantId.length.toString().padStart(2, "0")}${merchantId}`;
  const tag29 = `29${tag00.length.toString().padStart(2, "0")}${tag00}`;
  const tag62Sub01 = `01${trxId.length.toString().padStart(2, "0")}${trxId}`;
  const tag62 = `62${tag62Sub01.length.toString().padStart(2, "0")}${tag62Sub01}`;

  let payload = "";
  payload += "000201010212";
  payload += tag29;
  payload += "52045999";
  payload += "5802KH";
  payload += `59${merchantName.length.toString().padStart(2, "0")}${merchantName}`;
  payload += `60${merchantCity.length.toString().padStart(2, "0")}${merchantCity}`;
  payload += "5303840";
  payload += `54${amountStr.length.toString().padStart(2, "0")}${amountStr}`;
  payload += tag62;
  payload += "6304";

  const crc = crc16(payload);
  payload += crc;

  // ────── REDIRECT TO SUCCESS PAGE ──────
  const url = new URL("/order-success", req.url);
  url.searchParams.set("payload", payload);
  url.searchParams.set("amount", grandTotal.toFixed(2)); // ✅ include delivery fee
  url.searchParams.set("trxId", trxId);

  const res = NextResponse.redirect(url);
  res.cookies.set("cart", "[]", { path: "/", maxAge: 0 });
  res.cookies.set("cart-selected", "[]", { path: "/", maxAge: 0 });

  return res;
}
