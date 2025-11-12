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
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Items ({items.length})</h2>

        <form action="/api/cart/select-all" method="POST" className="flex items-center gap-2">
          <input type="hidden" name="redirect" value="/cart" />
          {/* <Checkbox id="select-all" /> */}
          <Button
            type="submit"
            name="action"
            value={allSelected ? "deselect" : "select"}
            variant="ghost"
            size="sm"
            className="text-sm"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </form>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {items.map((item, index) => {
              const isSelected = selectedIds.includes(item.id);
              const showMinus = item.quantity > 1;
              const isLast = index === items.length - 1;

              return (
                <div
                  key={item.id}
                  className={`px-6 py-5 flex items-center gap-4 ${
                    isSelected ? "bg-muted/50" : ""
                  } ${!isLast ? "" : "border-b-0"}`}
                >
                  {/* Toggle */}
                  <form action="/api/cart/toggle-select" method="POST" className="relative">
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="redirect" value="/cart" />
                    <Checkbox checked={isSelected} />
                    <button
                      type="submit"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label={isSelected ? "Deselect" : "Select"}
                    />
                  </form>

                  <div className="w-20 h-20 relative flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {showMinus ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/api/cart/add?id=${item.id}&qty=-1&redirect=/cart`}>-</a>
                      </Button>
                    ) : (
                      <div className="w-9 h-9" />
                    )}
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/api/cart/add?id=${item.id}&qty=1&redirect=/cart`}>+</a>
                    </Button>
                  </div>

                  <div className="text-right w-24 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <Button variant="ghost" size="sm" asChild>
                    <a href={`/api/cart/remove?id=${item.id}&redirect=/cart`}>Remove</a>
                  </Button>
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="px-6 py-4 flex justify-between text-lg font-semibold">
            <span>Selected Total ({selectedItems.length} items)</span>
            <span>${selectedTotal.toFixed(2)}</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between gap-4 p-6 pt-0">
          <div className="flex gap-2">
            <form action="/api/cart/clear" method="POST">
              <input type="hidden" name="redirect" value="/cart" />
              <Button type="submit" variant="outline">
                Clear Cart
              </Button>
            </form>

            {selectedIds.length > 0 && (
              <form action="/api/cart/remove-selected" method="POST">
                <input type="hidden" name="redirect" value="/cart" />
                <Button type="submit" variant="destructive" size="sm">
                  Remove Selected ({selectedIds.length})
                </Button>
              </form>
            )}
          </div>

          <form action="/checkout" method="POST">
            {selectedIds.map((id) => (
              <input key={id} type="hidden" name="selectedIds" value={id} />
            ))}
            <Button type="submit" disabled={selectedIds.length === 0}>
              Checkout Selected ({selectedIds.length})
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}