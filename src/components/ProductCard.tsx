// components/ProductCard.tsx
import ImageWithFallback from "./ImageWithFallback";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden border-0">
      <CardHeader className="p-0">
        <Link href={`/product/${product.id}`}>
          <div className="relative w-full aspect-square overflow-hidden">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 p-5 space-y-2">
        <h3 className="text-lg font-medium font-khmer-toch text-gray-800 line-clamp-2">
          <Link href={`/product/${product.id}`} className="hover:text-blue-600 transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-600 font-khmer-toch line-clamp-2">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between items-center p-5 pt-0">
        <span className="text-2xl font-bold text-gray-800 khmer-price">
          ${product.price.toFixed(2)}
        </span>
        <Button
          asChild
          className="mt-3 h-10 px-4 text-base font-khmer-toch bg-blue-600 hover:bg-blue-700"
        >
          <a href={`/api/cart/add?id=${product.id}&qty=1&redirect=/`}>
            បញ្ចូលទៅរទេះ
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}