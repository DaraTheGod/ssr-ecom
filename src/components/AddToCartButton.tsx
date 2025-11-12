"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cartContext";
import { Product } from "@/data/products";
import { useRouter } from "next/navigation";

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleClick = () => {
    addItem(product);   // ✅ Add to cart
    router.push("/");   // ✅ Redirect back to catalog
  };

  return (
    <Button
      size="lg"
      onClick={handleClick}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Add to Cart
    </Button>
  );
}
