// src/app/api/checkout/route.ts
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
    deliveryOption: formData.get("deliveryOption"),
    deliveryNotes: formData.get("deliveryNotes"),
  };

  console.log("Order received:", { selectedIds, total, customer });

  // ────── EXACT SAME KHQR LOGIC AS YOUR MODAL ──────
  const merchantId = "chhinchheang_dara@wing";
  const merchantName = "Chhinchheang Dara";
  const merchantCity = "Phnom Penh";
  const trxId = `TRX${Date.now()}`;
  const amountStr = total.toFixed(2);

  const tag00 = `00${merchantId.length.toString().padStart(2, "0")}${merchantId}`;
  const merchantAccountInfo = tag00;
  const tag29 = `29${merchantAccountInfo.length.toString().padStart(2, "0")}${merchantAccountInfo}`;
  const tag62Sub01 = `01${trxId.length.toString().padStart(2, "0")}${trxId}`;
  const tag62 = `62${tag62Sub01.length.toString().padStart(2, "0")}${tag62Sub01}`;

  let payload = "";
  payload += "000201"; // Payload Format Indicator
  payload += "010212"; // Point of Initiation Method (12 = dynamic)
  payload += tag29;    // Merchant Account Information
  payload += "52045999"; // Merchant Category Code
  payload += "5802KH";   // Currency Code (KH = Cambodia)
  payload += `59${merchantName.length.toString().padStart(2, "0")}${merchantName}`;
  payload += `60${merchantCity.length.toString().padStart(2, "0")}${merchantCity}`;
  payload += "5303840";  // Transaction Currency (840 = USD)
  payload += `54${amountStr.length.toString().padStart(2, "0")}${amountStr}`;
  payload += tag62;      // Additional Data Field (Bill Number)
  payload += "6304";     // CRC placeholder

  const crc = crc16(payload);
  payload += crc; // Final CRC

  // ────── PASS FULL PAYLOAD TO SUCCESS PAGE ──────
  const url = new URL("/order-success", req.url);
  url.searchParams.set("payload", payload);
  url.searchParams.set("amount", total.toFixed(2));
  url.searchParams.set("trxId", trxId);

  const res = NextResponse.redirect(url);
  res.cookies.set("cart", "[]", { path: "/", maxAge: 0 });
  res.cookies.set("cart-selected", "[]", { path: "/", maxAge: 0 });

  return res;
}