// src/app/(shop)/cart/page.tsx
import { cookies } from "next/headers";
import { products } from "@/data/products";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CartClient from "./_components/CartClient";
import CartBulkActions from "./_components/CartBulkActions"; // <-- new

type CartCookie = { id: string; quantity: number };
type CartItem = typeof products[number] & { quantity: number };

export default async function CartPage() {
  // --- Server: read cookies ---
  const cookieStore = await cookies(); // await is required
  const cartCookie = cookieStore.get("cart")?.value || "[]";
  const selectedCookie = cookieStore.get("cart-selected")?.value || "[]";

  const cart: CartCookie[] = JSON.parse(cartCookie);
  const selectedIds: string[] = JSON.parse(selectedCookie);

  const items: CartItem[] = cart
    .map((c) => {
      const product = products.find((p) => p.id === c.id);
      if (!product) return null;
      return { ...product, quantity: c.quantity };
    })
    .filter((i): i is CartItem => i !== null);

  const selectedItems = items.filter((i) => selectedIds.includes(i.id));
  const selectedTotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const allSelected = items.length > 0 && items.every((i) => selectedIds.includes(i.id));

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-4xl font-semibold mb-6 font-khmer text-gray-800">
          កន្រ្តកទំនិញរបស់អ្នកទទេ
        </h2>
        <Button asChild className="h-14 px-8 mt-2 text-lg font-khmer-toch bg-blue-600 hover:bg-blue-700">
          <Link href="/">ទៅទិញទំនិញ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold font-khmer text-gray-800">កន្ត្រកទំនិញរបស់អ្នក</h1>
        <Button asChild variant="outline" size="lg" className="h-12 border-2 px-6 text-lg font-khmer-toch text-gray-700 hover:bg-gray-50">
          <Link href="/">ត្រឡប់</Link>
        </Button>
      </div>

      {/* Select All */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold font-khmer text-gray-700">
          មុខទំនិញ ({items.length})
        </h2>
        <form action="/api/cart/select-all" method="POST" className="flex items-center gap-2">
          <input type="hidden" name="redirect" value="/cart" />
          <Button
            type="submit"
            name="action"
            value={allSelected ? "deselect" : "select"}
            variant="ghost"
            size="sm"
            className="text-base font-khmer-toch text-gray-700 hover:bg-gray-100"
          >
            {allSelected ? "មិនជ្រើសរើសទាំងអស់" : "ជ្រើសរើសទាំងអស់"}
          </Button>
        </form>
      </div>

      {/* Card */}
      <Card className="shadow-xl border-0 rounded-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Scrollable Table */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="min-w-[640px] sm:min-w-0">
              <div className="divide-y divide-gray-200">
                <CartClient items={items} selectedIds={selectedIds} />
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Bulk Actions – OUTSIDE scroll */}
          {/* ... inside CardContent ... */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 pt-8 -mb-10">
            <CartBulkActions selectedCount={selectedIds.length} />
          </div>

          {/* Total */}
          <div className="px-6 py-5 flex justify-between items-center text-xl font-bold -mb-8">
            <span className="font-khmer text-gray-800 mt-3">
              ចំនួនទឹកប្រាក់សរុប ({selectedItems.length} មុខ)
            </span>
            <span className="text-blue-600 khmer-price text-2xl">
              ${selectedTotal.toFixed(2)}
            </span>
          </div>

        </CardContent>

        {/* Checkout */}
        <CardFooter className="flex justify-end p-6 pt-0 border-t -mb-6">
          <form action="/checkout" method="POST" className="w-full sm:w-auto">
            {selectedIds.map((id) => (
              <input key={id} type="hidden" name="selectedIds" value={id} />
            ))}
            <Button
              type="submit"
              disabled={selectedIds.length === 0}
              className="w-full sm:w-auto h-14 text-xl font-khmer-toch bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              ទៅបង់ប្រាក់ទំនិញ
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}