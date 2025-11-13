// src/app/(shop)/checkout/_components/CheckoutSummary.tsx
"use client";

import { useState, useEffect } from "react";

interface Props {
  subtotal: number;
}

export default function CheckoutSummary({ subtotal }: Props) {
  const [deliveryFee, setDeliveryFee] = useState(3); // default: standard

  useEffect(() => {
    const updateFee = () => {
      const checked = document.querySelector('input[name="deliveryOption"]:checked') as HTMLInputElement;
      const value = checked?.value || "standard";

      if (value === "express") setDeliveryFee(6);
      else if (value === "standard") setDeliveryFee(3);
      else setDeliveryFee(0);
    };

    updateFee(); // initial

    const radios = document.querySelectorAll('input[name="deliveryOption"]');
    radios.forEach((r) => r.addEventListener("change", updateFee));

    return () => {
      radios.forEach((r) => r.removeEventListener("change", updateFee));
    };
  }, []);

  const total = subtotal + deliveryFee;

  return (
    <div className="border-t pt-4 space-y-2">
      <div className="flex justify-between text-lg">
        <span className="font-khmer text-gray-700">ទំនិញសរុប</span>
        <span className="text-gray-800 khmer-price">${subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-lg">
        <span className="font-khmer text-gray-700">ថ្លៃដឹកជញ្ជូន</span>
        <span className="text-gray-800 khmer-price">
          {deliveryFee === 0 ? "ឥតគិតថ្លៃ" : `$${deliveryFee.toFixed(2)}`}
        </span>
      </div>

      <div className="flex justify-between text-xl font-bold pt-2 border-t">
        <span className="font-khmer text-gray-800">សរុបត្រូវបង់</span>
        <span className="text-blue-600 khmer-price">${total.toFixed(2)}</span>
      </div>

      {/* Hidden inputs for form submit */}
      <input type="hidden" name="deliveryFee" value={deliveryFee.toFixed(2)} />
      <input type="hidden" name="total" value={total.toFixed(2)} />
    </div>
  );
}