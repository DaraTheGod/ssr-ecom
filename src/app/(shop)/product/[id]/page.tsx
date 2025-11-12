import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="relative aspect-square">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
        <p className="text-2xl font-semibold text-primary mb-4">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-muted-foreground mb-6">{product.description}</p>
        <Button size="lg" asChild>
          <a href={`/api/cart/add?id=${product.id}&qty=1&redirect=/`}>Add to Cart</a>
        </Button>
      </div>
    </div>
  );
}