// src/app/(shop)/cart/page.tsx
import { cookies } from "next/headers";
import { products } from "@/data/products";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

type CartCookie = { id: string; quantity: number };
type CartItem = typeof products[number] & { quantity: number };

export default async function CartPage() {
  const cookieStore = await cookies();
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
        <h2 className="text-4xl font-semibold mb-6 font-khmer text-gray-800">រទេះទំនិញរបស់អ្នកទទេ</h2>
        <Button asChild className="h-14 px-8 text-lg font-khmer-toch bg-blue-600 hover:bg-blue-700">
          <Link href="/">បន្តទំនិញ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold font-khmer text-gray-800">រទេះទំនិញរបស់អ្នក</h1>
        <Button asChild variant="outline" size="lg" className="h-12 border-2 px-6 text-lg font-khmer-toch text-gray-700 hover:bg-gray-50">
          <Link href="/">ត្រឡប់ទៅហាង</Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold font-khmer text-gray-700">មុខទំនិញ ({items.length})</h2>

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

      <Card className="shadow-xl border-0 rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {items.map((item, index) => {
              const isSelected = selectedIds.includes(item.id);
              const showMinus = item.quantity > 1;
              const isLast = index === items.length - 1;

              return (
                <div
                  key={item.id}
                  className={`px-6 py-5 flex items-center gap-4 transition-colors cart-item-hover ${
                    !isLast ? "" : "border-b-0"
                  }`}
                >
                  {/* Toggle */}
                  <form action="/api/cart/toggle-select" method="POST" className="relative">
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="redirect" value="/cart" />
                    <Checkbox checked={isSelected} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                    <button
                      type="submit"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label={isSelected ? "មិនជ្រើសរើស" : "ជ្រើសរើស"}
                    />
                  </form>

                  <div className="w-20 h-20 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium font-khmer-toch text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600 font-khmer-toch">
                      ${item.price.toFixed(2)} ក្នុងមួយ
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {showMinus ? (
                      <Button variant="outline" size="sm" asChild className="h-10 w-10 p-0">
                        <a href={`/api/cart/add?id=${item.id}&qty=-1&redirect=/cart`} className="text-lg">
                          −
                        </a>
                      </Button>
                    ) : (
                      <div className="w-10 h-10" />
                    )}
                    <span className="w-12 text-center font-bold text-lg khmer-price text-gray-800">{item.quantity}</span>
                    <Button variant="outline" size="sm" asChild className="h-10 w-10 p-0">
                      <a href={`/api/cart/add?id=${item.id}&qty=1&redirect=/cart`} className="text-lg">
                        +
                      </a>
                    </Button>
                  </div>

                  <div className="text-right w-28 font-bold text-xl khmer-price text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <Button variant="ghost" size="sm" asChild className="font-khmer-toch text-lg text-red-600 hover:text-red-700 hover:bg-red-50">
                    <a href={`/api/cart/remove?id=${item.id}&redirect=/cart`}>លុប</a>
                  </Button>
                </div>
              );
            })}
          </div>

          <Separator className="bg-gray-200" />

          <div className="px-6 py-5 flex justify-between items-center text-xl font-bold">
            <span className="font-khmer text-gray-800 mt-3">សរុបដែលបានជ្រើសរើស ({selectedItems.length} មុខ)</span>
            <span className="text-blue-600 khmer-price text-2xl">${selectedTotal.toFixed(2)}</span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <form action="/api/cart/clear" method="POST">
              <input type="hidden" name="redirect" value="/cart" />
              <Button type="submit" variant="outline" className="w-full sm:w-auto h-12 font-khmer-toch text-base border-gray-300 hover:bg-gray-100">
                លុបទំនិញក្នុងរទះទាំងអស់
              </Button>
            </form>

            {selectedIds.length > 0 && (
              <form action="/api/cart/remove-selected" method="POST">
                <input type="hidden" name="redirect" value="/cart" />
                <Button type="submit" variant="destructive" size="sm" className="w-full sm:w-auto h-12 font-khmer-toch text-base">
                  លុបទំនិញដែលបានជ្រើសរើស ({selectedIds.length})
                </Button>
              </form>
            )}
          </div>

          <form action="/checkout" method="POST" className="w-full sm:w-auto">
            {selectedIds.map((id) => (
              <input key={id} type="hidden" name="selectedIds" value={id} />
            ))}
            <Button
              type="submit"
              disabled={selectedIds.length === 0}
              className="w-full sm:w-auto h-14 text-xl font-khmer-toch bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              ទៅបង់ប្រាក់ទំនិញ ({selectedIds.length})
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}