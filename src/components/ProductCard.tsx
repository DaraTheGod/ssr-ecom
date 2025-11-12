import ImageWithFallback from "./ImageWithFallback";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <Link href={`/product/${product.id}`}>
            <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
            <ImageWithFallback
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
            />
            </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="text-lg">
          <Link href={`/product/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <span className="text-xl font-semibold">${product.price.toFixed(2)}</span>
        <Button asChild>
          <a href={`/api/cart/add?id=${product.id}&qty=1&redirect=/`}>Add to Cart</a>
        </Button>
      </CardFooter>
    </Card>
  );
}