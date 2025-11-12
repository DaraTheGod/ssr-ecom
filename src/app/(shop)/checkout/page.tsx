// src/app/(shop)/checkout/page.tsx
import { cookies } from "next/headers";
import { products } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import PayWithKHQR from "@/components/PayWithKHQR";

type CartItem = typeof products[number] & { quantity: number };

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart")?.value || "[]";
  const selectedCookie = cookieStore.get("cart-selected")?.value || "[]";

  const cart: { id: string; quantity: number }[] = JSON.parse(cartCookie);
  const selectedIds: string[] = JSON.parse(selectedCookie);

  const items: CartItem[] = selectedIds
    .map((id) => {
      const product = products.find((p) => p.id === id);
      const entry = cart.find((c) => c.id === id);
      if (!product || !entry) return null;
      return { ...product, quantity: entry.quantity };
    })
    .filter((i): i is CartItem => i !== null);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No items selected</h2>
        <Button asChild>
          <Link href="/cart">Back to Cart</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ─── DELIVERY INFORMATION ─── */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form action="/api/checkout" method="POST" className="space-y-4">
              {selectedIds.map((id) => (
                <input key={id} type="hidden" name="selectedIds" value={id} />
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required placeholder="Dara" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required placeholder="ChhinChheang" />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" required placeholder="+855 12 345 678" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street">Street</Label>
                  <Input id="street" name="street" required placeholder="House #123, Street 456" />
                </div>
                <div>
                  <Label htmlFor="commune">Commune</Label>
                  <Input id="commune" name="commune" required placeholder="Sangkat Toul Svay Prey" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input id="district" name="district" required placeholder="Chamkar Mon" />
                </div>
                <div>
                  <Label htmlFor="province">City / Province</Label>
                  <Input id="province" name="province" required placeholder="Phnom Penh" />
                </div>
              </div>

              <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Place Order & Pay Later
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ─── ORDER SUMMARY ─── */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary ({items.length} items)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded" />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="text-right font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── KHQR PAYMENT (Client Component) ─── */}
      {/* <PayWithKHQR amount={total} /> */}
    </div>
  );
}