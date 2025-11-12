"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react"; // ✅ Import Plus and Minus
import { useCart } from "@/lib/cartContext";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="flex gap-4 items-center">
      {/* Image */}
      <div className="relative w-20 h-20">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded"
        />
      </div>

      {/* Name and Price */}
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          ${item.price.toFixed(2)} each
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          className="w-16 text-center"
          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Total Price */}
      <div className="text-right w-24 font-medium">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      {/* Remove Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => removeItem(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
