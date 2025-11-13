import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Catalog() {
  return (
    <div>
      {/* <h1 className="text-3xl font-bold mb-6">Product Catalog</h1> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}