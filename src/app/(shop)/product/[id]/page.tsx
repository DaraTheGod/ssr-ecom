// src/app/product/[id]/page.tsx
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ qty?: string }>;
}) {
  const { id } = await params;
  const { qty: qtyParam } = await searchParams;

  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  // Parse quantity from URL, default to 1, min 1
  const qty = Math.max(1, parseInt(qtyParam || "1", 10) || 1);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-xl">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-khmer text-gray-800 leading-tight">
                {product.name}
              </h1>
              <p className="mt-3 text-3xl font-bold text-blue-600 khmer-price">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="text-base text-gray-700 font-khmer-toch leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mt-4">
              <span className="text-2xl font-medium font-khmer-toch mt-1 text-gray-700">ចំនួន:</span>
              <div className="flex items-center gap-0 overflow-hidden rounded-lg border-2 border-gray-300">
                {/* Decrease */}
                <form action={`/product/${id}`} method="GET">
                  <input type="hidden" name="qty" value={Math.max(1, qty - 1)} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none border-r-2 border-gray-300 text-lg font-bold"
                    disabled={qty <= 1}
                  >
                    −
                  </Button>
                </form>

                {/* Quantity */}
                <span className="flex h-12 w-16 items-center justify-center font-bold text-lg khmer-price text-gray-800">
                  {qty}
                </span>

                {/* Increase */}
                <form action={`/product/${id}`} method="GET">
                  <input type="hidden" name="qty" value={qty + 1} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none border-l-2 border-gray-300 text-lg font-bold"
                  >
                    +
                  </Button>
                </form>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="h-14 text-xl font-khmer-toch bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
              >
                <a href={`/api/cart/add?id=${product.id}&qty=${qty}&redirect=/cart`}>
                  ដាក់ចូលកន្ត្រក ({qty})
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 border-2 px-8 text-lg font-khmer-toch text-gray-700 hover:bg-gray-100"
              >
                <Link href="/">ត្រឡប់ទៅទំព័រដើម</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}