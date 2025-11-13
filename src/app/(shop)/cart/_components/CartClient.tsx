// src/app/(shop)/cart/_components/CartClient.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ImageWithFallback from "@/components/ImageWithFallback";
import ConfirmDialog from "@/components/ConfirmDialog";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

interface Props {
  items: CartItem[];
  selectedIds: string[];
}

export default function CartClient({ items, selectedIds }: Props) {
  const [deleteOneId, setDeleteOneId] = useState<string | null>(null);

  return (
    <>
      {items.map((item, index) => {
        const isSelected = selectedIds.includes(item.id);
        const showMinus = item.quantity > 1;
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.id}
            className={`px-6 py-5 flex items-center gap-4 transition-colors cart-item-hover ${
              isLast ? "border-b-0" : ""
            }`}
          >
            {/* ---- toggle ---- */}
            <form action="/api/cart/toggle-select" method="POST" className="relative">
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="redirect" value="/cart" />
              <Checkbox
                checked={isSelected}
                className="data-[state=checked]:bg-blue-600 data,border-blue-600"
              />
              <button
                type="submit"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label={isSelected ? "មិនជ្រើសរើស" : "ជ្រើសរើស"}
              />
            </form>

            {/* ---- image ---- */}
            <div className="w-20 h-20 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <ImageWithFallback src={item.image} alt={item.name} fill className="object-cover" />
            </div>

            {/* ---- name & price ---- */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium font-khmer-toch text-gray-800 truncate">{item.name}</h3>
              <p className="text-sm text-gray-600 font-khmer-toch">
                ${item.price.toFixed(2)} ក្នុងមួយ
              </p>
            </div>

            {/* ---- quantity ---- */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {showMinus ? (
                <Button variant="outline" size="sm" asChild className="h-10 w-10 p-0">
                  <a href={`/api/cart/add?id=${item.id}&qty=-1&redirect=/cart`} className="text-lg">
                    −
                  </a>
                </Button>
              ) : (
                <div className="w-10 h-10" />
              )}
              <span className="w-12 text-center font-bold text-lg khmer-price text-gray-800">
                {item.quantity}
              </span>
              <Button variant="outline" size="sm" asChild className="h-10 w-10 p-0">
                <a href={`/api/cart/add?id=${item.id}&qty=1&redirect=/cart`} className="text-lg">
                  +
                </a>
              </Button>
            </div>

            {/* ---- total ---- */}
            <div className="text-right w-28 font-bold text-xl khmer-price text-gray-800 flex-shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            {/* ---- delete one ---- */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteOneId(item.id)}
              className="font-khmer-toch text-lg text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
            >
              លុប
            </Button>

            {/* ---- confirm delete one ---- */}
            <ConfirmDialog
              open={deleteOneId === item.id}
              title="លុបទំនិញ?"
              description="តើអ្នកប្រាកដជាចង់លុបទំនិញនេះចេញពីកន្ត្រកទេ?"
              onConfirm={() => (window.location.href = `/api/cart/remove?id=${item.id}&redirect=/cart`)}
              onCancel={() => setDeleteOneId(null)}
            />
          </div>
        );
      })}
    </>
  );
}