// src/app/order-success/page.tsx
import QRCode from "qrcode";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

/* ------------------------------------------------------------------ */
/* ✅ Generate KHQR Payload */
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

async function generatePayload(amount: number, trxId: string): Promise<string> {
  const merchantId = "chhinchheang_dara@wing";
  const merchantName = "Chhinchheang Dara";
  const merchantCity = "Phnom Penh";
  const amountStr = amount.toFixed(2);

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
  return payload + crc;
}

/* ------------------------------------------------------------------ */
export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; trxId?: string; regenerate?: string }>;
}) {
  const { amount = "0", trxId: urlTrxId } = await searchParams;
  const total = Number(amount) || 0;
  if (total <= 0) redirect("/");

  const trxId = urlTrxId || `TRX${Date.now()}`;
  const payload = await generatePayload(total, trxId);
  const qrDataUrl = await QRCode.toDataURL(payload, { width: 300, margin: 1 });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 -mt-30">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center space-y-4">

        {/* Header */}
        <div className="w-full bg-red-600 text-white text-center rounded-xl py-2">
          <h1 className="text-3xl font-bold font-khmer">KHQR</h1>
          <p className="text-lg opacity-90 font-khmer-toch -mt-2">ស្កេន QR ដើម្បីបង់ប្រាក់</p>
        </div>

        {/* Merchant info */}
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800">Chhinchheang Dara</p>
        </div>

        {/* Amount + ID */}
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600">${total.toFixed(2)}</p>
          <p className="text-xs text-gray-400 font-mono mt-1">{trxId}</p>
        </div>

        {/* QR Image */}
        <div className="bg-white p-2 border rounded-xl shadow-sm">
          <img src={qrDataUrl} alt="KHQR" className="w-56 h-56" />
        </div>

        {/* Instruction */}
        <p className="text-sm text-gray-700 text-center font-khmer-toch">
          ប្រើកម្មវិធីធនាគារដែលគាំទ្រ Bakong ដើម្បីបង់ប្រាក់។
        </p>

        {/* Back Home */}
        <Button asChild variant="outline" className="mt-4 w-full flex items-center justify-center text-lg gap-2 text-gray-700 text-center font-khmer-toch p-6">
          <Link href="/">
            ​បានទូទាត់រួច
            {/* <Home className="w-4 h-4" /> */}
            {/* ត្រឡប់ទៅទំព័រដើម */}
          </Link>
        </Button>
      </div>
    </div>
  );
}
