// src/components/PayWithKHQR.tsx
"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PayWithKHQRProps {
  amount: number;
}

export default function PayWithKHQR({ amount }: PayWithKHQRProps) {
  const [open, setOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [expired, setExpired] = useState(false);

  const merchantId = "chhinchheang_dara@wing";
  const merchantName = "Chhinchheang Dara";
  const merchantCity = "Phnom Penh";
  const trxId = `TRX${Date.now()}`;

  const generate = async () => {
    const amountStr = amount.toFixed(2);
    const tag00 = `00${merchantId.length.toString().padStart(2, "0")}${merchantId}`;
    const tag29 = `29${tag00.length.toString().padStart(2, "0")}${tag00}`;
    const tag62Sub01 = `01${trxId.length.toString().padStart(2, "0")}${trxId}`;
    const tag62 = `62${tag62Sub01.length.toString().padStart(2, "0")}${tag62Sub01}`;

    let payload = "";
    payload += "000201"; // Payload Format
    payload += "010212"; // Dynamic
    payload += tag29;
    payload += "52045999"; // MCC
    payload += "5802KH"; // Country
    payload += `59${merchantName.length.toString().padStart(2, "0")}${merchantName}`;
    payload += `60${merchantCity.length.toString().padStart(2, "0")}${merchantCity}`;
    payload += "5303840"; // Currency: USD
    payload += `54${amountStr.length.toString().padStart(2, "0")}${amountStr}`;
    payload += tag62;
    payload += "6304"; // CRC placeholder

    const crc = crc16(payload);
    payload += crc;

    const url = await QRCode.toDataURL(payload, { width: 350, margin: 2 });
    setQrUrl(url);
  };

  useEffect(() => {
    if (open) {
      generate();
      setTimeLeft(30);
      setExpired(false);

      const timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setExpired(true);
            clearInterval(timer);
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [open, amount]);

  const handleRegenerate = () => {
    generate();
    setTimeLeft(30);
    setExpired(false);
  };

  const handleClose = (paid: boolean) => {
    setOpen(false);
    if (paid) {
      alert("Payment confirmed! Order placed.");
    }
  };

  return (
    <>
      <div className="mt-8 flex justify-center">
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Pay with KHQR ${amount.toFixed(2)}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={() => handleClose(false)}>
        <DialogContent className="max-w-md p-0">
          <div className="bg-white">
            {/* Header */}
            <div className="bg-red-700 text-white text-center py-8">
              <h3 className="text-3xl font-bold">KHQR</h3>
            </div>

            <div className="p-6 text-center space-y-4">
              <h4 className="text-2xl font-bold">{merchantName}</h4>
              <p className="text-4xl font-bold text-green-600">${amount.toFixed(2)}</p>
              <div className="text-gray-400">────────────────────────────────</div>

              {qrUrl && (
                <div className="flex justify-center">
                  <img src={qrUrl} alt="KHQR Code" className="w-64 h-64" />
                </div>
              )}

              <p className={`text-sm font-medium ${expired ? "text-red-600" : "text-gray-500"}`}>
                QR expires in {timeLeft}s
              </p>

              {expired && (
                <div className="space-y-3">
                  <p className="text-red-600 font-semibold">QR Expired!</p>
                  <Button onClick={handleRegenerate} className="w-full">
                    Generate New QR
                  </Button>
                </div>
              )}

              {!expired && (
                <Button
                  onClick={() => handleClose(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Payment Received
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// CRC16-CCITT
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