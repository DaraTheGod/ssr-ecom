// src/app/(shop)/checkout/page.tsx
import { cookies } from "next/headers";
import { products } from "@/data/products";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import ImageWithFallback from "@/components/ImageWithFallback";

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
      <div className="text-center py-16">
        <h2 className="text-4xl font-semibold mb-6 font-khmer text-gray-800">
          គ្មានទំនិញបានជ្រើសរើស
        </h2>
        <Button
          asChild
          className="h-14 px-8 text-lg font-khmer-toch bg-blue-600 hover:bg-blue-700"
        >
          <Link href="/cart">ត្រឡប់ទៅរទេះទំនិញ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10 font-khmer text-gray-800">
        បង់ប្រាក់
      </h1>

      <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8">
        {/* ─── DELIVERY INFORMATION ─── */}
        <Card className="shadow-xl border-0 rounded-xl">
          <CardContent className="py-4 space-y-8">
            {/* Normal HTML form – no client JS */}
            <form action="/api/checkout" method="POST" className="space-y-6">
              {/* hidden selected ids */}
              {selectedIds.map((id) => (
                <input key={id} type="hidden" name="selectedIds" value={id} />
              ))}
              <input type="hidden" name="total" value={total.toFixed(2)} />
              {/* 1. Customer Info */}
              <div>
                <Label className="text-2xl font-khmer text-gray-800 mb-4 block">
                  ព័ត៌មានអតិថិជន
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-khmer-toch text-gray-700" htmlFor="firstName">
                      ឈ្មោះពេញ
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      placeholder="ឈិនឈាង ដារា"
                      className="mt-1 font-khmer-toch text-base placeholder:text-base text-gray-700"
                    />
                  </div>
                  <div>
                    <Label className="text-base font-khmer-toch text-gray-700" htmlFor="phone">
                      លេខទូរស័ព្ទ
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+855 12 345 678"
                      className="mt-1 font-khmer-toch text-base placeholder:text-base text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Address */}
              <div>
                <Label className="text-2xl font-khmer text-gray-800 mb-4 block">
                  អាស័យដ្ឋានដឹកជញ្ជូន
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-khmer-toch text-gray-700" htmlFor="province">
                      រាជធានី/ខេត្ត
                    </Label>
                    <Input
                      id="province"
                      name="province"
                      required
                      placeholder="រាជធានីភ្នំពេញ"
                      className="mt-1 font-khmer-toch text-base placeholder:text-base text-gray-700"
                    />
                  </div>
                  <div>
                    <Label className="text-base font-khmer-toch text-gray-700" htmlFor="district">
                      ស្រុក/ខណ្ឌ
                    </Label>
                    <Input
                      id="district"
                      name="district"
                      required
                      placeholder="ខណ្ឌចំការមន"
                      className="mt-1 font-khmer-toch text-base placeholder:text-base text-gray-700"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label className="text-base font-khmer-toch text-gray-700" htmlFor="commune">
                      ឃុំ/សង្កាត់
                    </Label>
                    <Input
                      id="commune"
                      name="commune"
                      required
                      placeholder="សង្កាត់ ទួលស្វាយព្រៃ"
                      className="mt-1 font-khmer-toch text-base placeholder:text-base text-gray-700"
                    />
                  </div>
                  <div>
                    <Label className="text-base font-khmer-toch text-gray-700" htmlFor="street">
                      ផ្ទះលេខ និង ផ្លូវ
                    </Label>
                    <Input
                      id="street"
                      name="street"
                      required
                      placeholder="ផ្ទះ #123, ផ្លូវ 456"
                      className="mt-1 font-khmer-toch text-base placeholder:text-base text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Delivery Options */}
              <div>
                <Label className="text-2xl font-khmer text-gray-800 mb-4 block">
                  ជម្រើសដឹកជញ្ជូន
                </Label>
                <RadioGroup name="deliveryOption" defaultValue="standard" className="">
                  <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition">
                    <RadioGroupItem value="standard" />
                    <span className="text-base font-khmer-toch text-gray-700">
                      ដឹកជញ្ជូនស្ដង់ដារ (២-៣ ថ្ងៃ) - $3.00
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition">
                    <RadioGroupItem value="express" />
                    <span className="text-base font-khmer-toch text-gray-700">
                      ដឹកជញ្ជូនរហ័ស (១ ថ្ងៃ) - $6.00
                    </span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition">
                    <RadioGroupItem value="pickup" />
                    <span className="text-base font-khmer-toch text-gray-700">
                      ទទួលដោយខ្លួនឯង (ឥតគិតថ្លៃ)
                    </span>
                  </label>
                </RadioGroup>
              </div>

              {/* 4. Notes */}
              <div>
                <Label className="text-2xl font-khmer text-gray-800 mb-3 block" htmlFor="notes">
                  កំណត់សម្គាល់សម្រាប់ការដឹកជញ្ជូន
                </Label>
                <Textarea
                  id="notes"
                  name="deliveryNotes"
                  placeholder="ឧទាហរណ៍: សូមដឹកមុនម៉ោង ១០ព្រឹក, ឬ ទុកនៅមុខផ្ទះ..."
                  className="mt-1 min-h-28 resize-none font-khmer-toch text-base placeholder:text-base text-gray-700"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-xl font-khmer-toch bg-blue-600 hover:bg-blue-700"
              >
                បញ្ជាទិញ & បង់ប្រាក់
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ─── ORDER SUMMARY ─── */}
        <Card className="shadow-xl border-0 rounded-xl h-fit">
          <CardHeader className="py-4 space-y-8 -mb-8">
            <h2 className="text-2xl font-bold font-khmer text-gray-800">
              សង្ខេបការបញ្ជាទិញ ({items.length} មុខ)
            </h2>
          </CardHeader>
          <CardContent className="space-y-5">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-800 font-khmer-toch">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600 font-khmer-toch">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>

                <div className="text-right font-bold text-xl text-gray-800 khmer-price mt-3">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="border-t pt-4 -mb-4">
              <div className="flex justify-between text-xl font-bold">
                <span className="font-khmer text-gray-800">សរុប</span>
                <span className="text-blue-600 khmer-price">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}